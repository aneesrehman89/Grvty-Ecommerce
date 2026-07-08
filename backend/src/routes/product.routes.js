import express from 'express';
import {getProducts, getProductsByTag, getProductsBySlug, createProduct, getSearchProducts, getFeaturedProducts, getNewArrivals} from '../controllers/product.controller.js';

const router = express.Router();


// Important : static routes must be declared before the dynamic '/:slug' route/routes

router.get('/featured', getFeaturedProducts);
router.get('/search', getSearchProducts );
router.get('/new-arrivals', getNewArrivals );
router.get('/tag/:tag', getProductsByTag);

router.route('/').get(getProducts).post(createProduct);
router.route('/:slug').get(getProductsBySlug);

export default router;
