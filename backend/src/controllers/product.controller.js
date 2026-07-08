import Product from "../models/Product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import {
  buildProductFilter,
  buildProductSort,
  buildPagination,
} from "../utils/queryHelpers.js";

// GET /api/v1/products - get filtered products [with filter and without works for both]
export const getProducts = asyncHandler(async (req, res) => {
  const filter = buildProductFilter(req.query);
  const sort = buildProductSort(req.query.sort);
  const { page, limit, skip } = buildPagination(req.query);

  const [products, total] = await Promise.all([
    // reduce server load
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug"),
    Product.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Products fetched successfully", {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// Get api/v1/products/tag/:tag - navbar user select [new-Arrival, best-seller, summer edit]
export const getProductsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;

  const products = await Product.find({ isActive: true, tags: tag })
    .sort({ createdAt: -1 })
    .populate("category", "name slug");

  sendResponse(
    res,
    200,
    `Products tagged "${tag}" fetched successfully`,
    products,
  );
});

// GET /api/v1/products/:slug - Single product by SEO-friendly slug
export const getProductsBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate("category", "name slug");
  if (!product) {
    throw new AppError(`No product found with slug "${req.params.slug}"`, 404);
  }

  sendResponse(res, 200, "Product fetched successfully", product);
});

// Get api/v1/products/search?q= - Full text search across product name
export const getSearchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    throw new AppError('Search query "q" is required', 400);
  }

  const products = await Product.find(
    { $text: { $search: q }, isActive: true },
    { score: { $meta: "textScore" } },
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("category", "name slug");

  sendResponse(res, 200, `Search results for "${q}"`, products);
});

// GET /api/v1/products/featured - homepage tagged products [new-Arrival, best-seller, summer edit]
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, tags: "featured" })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("category", "name slug");

  sendResponse(res, 200, "Featured products fetched successfully", products);
});

// GET /api/v1/products/new-arrivals - Latest 20 products
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("category", "name slug");

  sendResponse(res, 200, "New arrivals fetched successfully", products);
});

// POST /api/v1/products -  Create a new product [Open for now — will be protected behind admin auth in Phase 3]
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, images, variants, tags } = req.body;
 
  if (!name || !description || !price || !category || !images || !variants) {
    throw new AppError(
      'name, description, price, category, images, and variants are all required',
      400
    );
  }
 
  const product = await Product.create({
    name,
    description,
    price,
    category,
    images,
    variants,
    tags,
  });
 
  sendResponse(res, 201, 'Product created successfully', product);
});