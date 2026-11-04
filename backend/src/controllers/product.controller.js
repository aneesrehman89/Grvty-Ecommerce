import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';
import {
  buildProductFilter,
  buildProductSort,
  buildPagination,
  escapeRegex,
} from '../utils/queryHelpers.js';

const CATEGORY_FIELDS = 'name slug';

const paginatedResponse = async (filter, query, { sort, defaultLimit } = {}) => {
  const { page, limit, skip } = buildPagination(query, defaultLimit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort || buildProductSort(query.sort))
      .skip(skip)
      .limit(limit)
      .populate('category', CATEGORY_FIELDS),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
  };
};

// GET /api/v1/products — filtered, sorted, paginated listing
export const getProducts = asyncHandler(async (req, res) => {
  const filter = await buildProductFilter(req.query);
  const data = await paginatedResponse(filter, req.query);
  sendResponse(res, 200, 'Products fetched successfully', data);
});

// GET /api/v1/products/tag/:tag — e.g. best-seller, new-drop, summer-edit
export const getProductsByTag = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const products = await Product.find({ isActive: true, tags: req.params.tag })
    .sort({ soldCount: -1, createdAt: -1 })
    .limit(limit)
    .populate('category', CATEGORY_FIELDS);

  sendResponse(res, 200, `Products tagged "${req.params.tag}" fetched successfully`, products);
});

// GET /api/v1/products/search?q= — quick search used by the navbar
export const getSearchProducts = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    throw new AppError('Search query "q" is required', 400);
  }

  const pattern = new RegExp(escapeRegex(q), 'i');
  const products = await Product.find({ isActive: true, $or: [{ name: pattern }, { description: pattern }] })
    .sort({ soldCount: -1 })
    .limit(Math.min(Number(req.query.limit) || 8, 20))
    .select('name slug price images category')
    .populate('category', CATEGORY_FIELDS);

  sendResponse(res, 200, `Search results for "${q}"`, products);
});

// GET /api/v1/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, tags: 'featured' })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('category', CATEGORY_FIELDS);

  sendResponse(res, 200, 'Featured products fetched successfully', products);
});

// GET /api/v1/products/new-arrivals
export const getNewArrivals = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 20);
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category', CATEGORY_FIELDS);

  sendResponse(res, 200, 'New arrivals fetched successfully', products);
});

// GET /api/v1/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    'category',
    CATEGORY_FIELDS
  );
  if (!product) {
    throw new AppError(`No product found with slug "${req.params.slug}"`, 404);
  }

  sendResponse(res, 200, 'Product fetched successfully', product);
});

// GET /api/v1/products/:slug/related — same category, excluding the product itself
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).select('_id category');
  if (!product) throw new AppError('Product not found', 404);

  const products = await Product.find({
    isActive: true,
    category: product.category,
    _id: { $ne: product._id },
  })
    .sort({ soldCount: -1 })
    .limit(4)
    .populate('category', CATEGORY_FIELDS);

  sendResponse(res, 200, 'Related products fetched successfully', products);
});

// ------------------------- Admin -------------------------

// GET /api/v1/products/admin/all — includes inactive products
export const getAdminProducts = asyncHandler(async (req, res) => {
  const filter = await buildProductFilter(req.query, { includeInactive: true });
  if (req.query.status === 'active') filter.isActive = true;
  if (req.query.status === 'inactive') filter.isActive = false;
  if (req.query.lowStock === 'true') filter['variants.stock'] = { $lte: 5 };

  const data = await paginatedResponse(filter, req.query, { defaultLimit: 20 });
  sendResponse(res, 200, 'Products fetched successfully', data);
});

// GET /api/v1/products/admin/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', CATEGORY_FIELDS);
  if (!product) throw new AppError('Product not found', 404);
  sendResponse(res, 200, 'Product fetched successfully', product);
});

const assertCategoryExists = async (categoryId) => {
  if (!categoryId) return;
  const exists = await Category.exists({ _id: categoryId });
  if (!exists) throw new AppError('Category does not exist', 400);
};

// POST /api/v1/products
export const createProduct = asyncHandler(async (req, res) => {
  await assertCategoryExists(req.body.category);
  const product = await Product.create(req.body);
  sendResponse(res, 201, 'Product created successfully', product);
});

// PATCH /api/v1/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  await assertCategoryExists(req.body.category);
  Object.assign(product, req.body);
  await product.save(); // save() re-runs validators and the slug hook
  sendResponse(res, 200, 'Product updated successfully', product);
});

// PATCH /api/v1/products/:id/stock — bulk set stock per variant
export const updateStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  for (const { variantId, stock } of req.body.variants) {
    const variant = product.variants.id(variantId);
    if (!variant) throw new AppError(`Variant ${variantId} not found on this product`, 404);
    variant.stock = stock;
  }

  await product.save();
  sendResponse(res, 200, 'Stock updated successfully', product);
});

// DELETE /api/v1/products/:id — soft delete so past orders keep their reference
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) throw new AppError('Product not found', 404);
  sendResponse(res, 200, 'Product archived successfully', product);
});
