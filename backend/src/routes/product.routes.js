import express from 'express';
import {
  getProducts,
  getProductsByTag,
  getProductBySlug,
  getRelatedProducts,
  getSearchProducts,
  getFeaturedProducts,
  getNewArrivals,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} from '../controllers/product.controller.js';
import { getProductReviews, createReview } from '../controllers/review.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  productSchema,
  updateProductSchema,
  updateStockSchema,
  createReviewSchema,
} from '../validators/schemas.js';

const router = express.Router();
const adminOnly = [protect, restrictTo('admin')];

// Static routes must be declared before the dynamic '/:slug' route
router.get('/featured', getFeaturedProducts);
router.get('/search', getSearchProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/tag/:tag', getProductsByTag);

// Admin
router.get('/admin/all', ...adminOnly, getAdminProducts);
router.get('/admin/:id', ...adminOnly, getProductById);

router.route('/').get(getProducts).post(...adminOnly, validate(productSchema), createProduct);

router
  .route('/:productId/reviews')
  .get(getProductReviews)
  .post(protect, validate(createReviewSchema), createReview);

router.patch('/:id/stock', ...adminOnly, validate(updateStockSchema), updateStock);
router.get('/:slug/related', getRelatedProducts);

router.get('/:slug', getProductBySlug);
router
  .route('/:id')
  .patch(...adminOnly, validate(updateProductSchema), updateProduct)
  .delete(...adminOnly, deleteProduct);

export default router;
