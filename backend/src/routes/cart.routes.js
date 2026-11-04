import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { addCartItemSchema, updateCartItemSchema, mergeCartSchema } from '../validators/schemas.js';

const router = express.Router();

// Guest carts live in the browser; the server cart is per logged-in user.
router.use(protect);

router.get('/', getCart);
router.post('/items', validate(addCartItemSchema), addItemToCart);
router
  .route('/items/:itemId')
  .patch(validate(updateCartItemSchema), updateCartItem)
  .delete(removeCartItem);
router.post('/merge', validate(mergeCartSchema), mergeCart);
router.delete('/clear', clearCart);

export default router;
