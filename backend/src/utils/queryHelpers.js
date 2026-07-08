/**
 * Builds a Mongoose filter object from query params like:
 *   ?category=hoodies&minPrice=2000&maxPrice=5000&tags=best-seller
 *
 * Kept separate from the controller so product.controller.js stays
 * readable — this is the only place that needs to know query param names.
 */

export const buildProductFilter = (query) => {
  const filter = { isActive: true };

  if (query.category) {
    filter.category = query.category; // expects a category ObjectId
  }

  if (query.tags) {
    // supports ?tags=best-seller or ?tags=best-seller,new-drop
    filter.tags = { $in: query.tags.split(',') };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return filter;
};

export const buildProductSort = (sortParam) => {
  switch (sortParam) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'popularity':
      return { numReviews: -1, rating: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
};

/**
 * Standard pagination math, shared by every list endpoint.
 * Defaults: page 1, 12 items per page.
 */

export const buildPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 12, 50); // cap at 50 to protect the DB
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};