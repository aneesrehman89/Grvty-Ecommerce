import express from 'express'
import {getCategories, getCategoryBySlug, createCategory} from '../controllers/category.controller.js'

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);

router.route('/:slug').get(getCategoryBySlug);

export default router;

