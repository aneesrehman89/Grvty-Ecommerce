import Category from '../models/Category.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  sendResponse(res, 200, 'Categories fetched successfully', categories);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });

  if (!category) {
    throw new AppError(`No category found with slug "${req.params.slug}"`, 404);
  }

  sendResponse(res, 200, "Category fetched successully", category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, parent } = req.body;

  if (!name || !image) {
    throw new AppError('Category name and image are required', 400);
  }

  const category = await Category.create({ name, description, image, parent });
  sendResponse(res, 201, 'Category created successfully', category);
});