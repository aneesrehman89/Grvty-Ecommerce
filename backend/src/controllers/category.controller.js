import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';

// GET /api/v1/categories — active categories with a live product count
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();

  const counts = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

  const data = categories.map((c) => ({ ...c, productCount: countMap.get(c._id.toString()) || 0 }));
  sendResponse(res, 200, 'Categories fetched successfully', data);
});

// GET /api/v1/categories/:slug
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) {
    throw new AppError(`No category found with slug "${req.params.slug}"`, 404);
  }
  sendResponse(res, 200, 'Category fetched successfully', category);
});

// POST /api/v1/categories (admin)
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  sendResponse(res, 201, 'Category created successfully', category);
});

// PATCH /api/v1/categories/:id (admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  Object.assign(category, req.body);
  await category.save(); // save() so the slug hook re-runs on rename
  sendResponse(res, 200, 'Category updated successfully', category);
});

// DELETE /api/v1/categories/:id (admin) — blocked while products still use it
export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.exists({ category: req.params.id });
  if (inUse) {
    throw new AppError('Cannot delete a category that still has products. Deactivate it instead.', 400);
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  sendResponse(res, 200, 'Category deleted successfully');
});
