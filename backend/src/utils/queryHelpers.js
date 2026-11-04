import mongoose from 'mongoose';
import Category from '../models/Category.model.js';

export const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Builds a Mongoose filter from query params like:
 *   ?category=hoodies&minPrice=2000&maxPrice=5000&tags=best-seller&size=M&q=tee&inStock=true
 *
 * `category` accepts either a category slug or an ObjectId.
 * Kept out of the controller so it is the only place that knows query param names.
 */
export const buildProductFilter = async (query, { includeInactive = false } = {}) => {
  const filter = includeInactive ? {} : { isActive: true };

  if (query.category) {
    if (mongoose.isValidObjectId(query.category)) {
      filter.category = query.category;
    } else {
      const slugs = String(query.category).split(',');
      const categories = await Category.find({ slug: { $in: slugs } }).select('_id');
      // Unknown slug → match nothing rather than everything
      filter.category = { $in: categories.map((c) => c._id) };
    }
  }

  if (query.tags) {
    // ?tags=best-seller or ?tags=best-seller,new-drop
    filter.tags = { $in: String(query.tags).split(',') };
  }

  if (query.size) {
    filter['variants.size'] = { $in: String(query.size).toUpperCase().split(',') };
  }

  if (query.inStock === 'true') {
    filter['variants.stock'] = { $gt: 0 };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.q && String(query.q).trim()) {
    // Regex (instead of $text) so partial words like "hood" still match "Hoodie"
    const pattern = new RegExp(escapeRegex(String(query.q).trim()), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }];
  }

  return filter;
};

export const buildProductSort = (sortParam) => {
  switch (sortParam) {
    case 'price_asc':
      return { price: 1, _id: 1 };
    case 'price_desc':
      return { price: -1, _id: 1 };
    case 'popularity':
      return { soldCount: -1, numReviews: -1, rating: -1 };
    case 'rating':
      return { rating: -1, numReviews: -1 };
    case 'newest':
    default:
      return { createdAt: -1, _id: -1 };
  }
};

/**
 * Standard pagination math shared by every list endpoint.
 * Defaults: page 1, 12 items per page, max 50.
 */
export const buildPagination = (query, defaultLimit = 12) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || defaultLimit, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
