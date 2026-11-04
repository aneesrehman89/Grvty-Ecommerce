import mongoose from 'mongoose';
import Review from '../models/Review.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';
import { buildPagination } from '../utils/queryHelpers.js';

// GET /api/v1/products/:productId/reviews
export const getProductReviews = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    throw new AppError('Invalid product id', 400);
  }
  const { page, limit, skip } = buildPagination(req.query, 5);
  const productId = new mongoose.Types.ObjectId(req.params.productId);
  const filter = { product: productId };

  const [reviews, total, breakdown] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments(filter),
    Review.aggregate([
      { $match: filter },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]),
  ]);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: breakdown.find((b) => b._id === star)?.count || 0,
  }));

  sendResponse(res, 200, 'Reviews fetched successfully', {
    reviews,
    distribution,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
  });
});

// POST /api/v1/products/:productId/reviews — one review per user per product
export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.exists({ _id: productId, isActive: true });
  if (!product) throw new AppError('Product not found', 404);

  const alreadyReviewed = await Review.exists({ product: productId, user: req.user._id });
  if (alreadyReviewed) {
    throw new AppError('You have already reviewed this product', 409);
  }

  const purchased = await Order.exists({
    user: req.user._id,
    status: 'delivered',
    'items.product': productId,
  });

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    name: req.user.name,
    rating: req.body.rating,
    comment: req.body.comment,
    isVerifiedBuyer: Boolean(purchased),
  });

  await Review.recalculateRating(review.product);
  sendResponse(res, 201, 'Review added', review);
});

// DELETE /api/v1/reviews/:id — author or admin
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);

  if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
    throw new AppError('You can only delete your own reviews', 403);
  }

  await review.deleteOne();
  await Review.recalculateRating(review.product);
  sendResponse(res, 200, 'Review deleted');
});
