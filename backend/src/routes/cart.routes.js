import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller.js';
 
const router = express.Router();

router.route('/').get(getCart);
router.route('/items').post(addItemToCart);
router.route('/items/:itemId').patch(updateCartItem).delete(removeCartItem);
router.route('/clear').delete(clearCart);


export default router;