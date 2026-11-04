import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelMyOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(validate(createOrderSchema), createOrder)
  .get(restrictTo('admin'), getAllOrders);

router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelMyOrder);
router.patch('/:id/status', restrictTo('admin'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
