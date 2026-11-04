import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { categorySchema, updateCategorySchema } from '../validators/schemas.js';

const router = express.Router();
const adminOnly = [protect, restrictTo('admin')];

router
  .route('/')
  .get(getCategories)
  .post(...adminOnly, validate(categorySchema), createCategory);

router.get('/:slug', getCategoryBySlug);

router
  .route('/:id')
  .patch(...adminOnly, validate(updateCategorySchema), updateCategory)
  .delete(...adminOnly, deleteCategory);

export default router;
