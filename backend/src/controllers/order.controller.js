import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';
import { buildPagination } from '../utils/queryHelpers.js';
import { reserveStock, releaseStock } from '../utils/stock.js';
import env from '../config/env.js';

export const calculateShipping = (itemsPrice) =>
  itemsPrice >= env.FREE_SHIPPING_THRESHOLD || itemsPrice === 0 ? 0 : env.SHIPPING_FEE;

// Allowed status transitions for the admin workflow
const NEXT_STATUSES = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

// POST /api/v1/orders — place an order from the user's server-side cart
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name slug images price variants isActive'
  );
  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty', 400);
  }

  // Build order lines from live product data (current price, variant info)
  const items = cart.items.map((item) => {
    const product = item.product;
    const variant = product?.isActive ? product.variants.id(item.variantId) : null;
    if (!variant) {
      throw new AppError('An item in your cart is no longer available. Please review your cart.', 409);
    }
    return {
      product: product._id,
      variantId: variant._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      size: variant.size,
      color: variant.color,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingPrice = calculateShipping(itemsPrice);

  await reserveStock(items);

  let order;
  try {
    order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      notes,
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
    });
  } catch (err) {
    await releaseStock(items);
    throw err;
  }

  cart.items = [];
  await Promise.all([
    cart.save(),
    // Remember the address to pre-fill the next checkout
    User.updateOne({ _id: req.user._id }, { shippingAddress, phone: shippingAddress.phone }),
  ]);

  sendResponse(res, 201, 'Order placed successfully', order);
});

// GET /api/v1/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Orders fetched successfully', orders);
});

// GET /api/v1/orders/:id — owner or admin
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new AppError('Order not found', 404);

  const isOwner = order.user._id.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    throw new AppError('Order not found', 404);
  }

  sendResponse(res, 200, 'Order fetched successfully', order);
});

// PATCH /api/v1/orders/:id/cancel — customers can cancel while still pending
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new AppError('Order not found', 404);

  if (order.status !== 'pending') {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  await order.save();
  await releaseStock(order.items);

  sendResponse(res, 200, 'Order cancelled', order);
});

// ------------------------- Admin -------------------------

// GET /api/v1/orders — all orders, filterable by status
export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const { page, limit, skip } = buildPagination(req.query, 20);
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  sendResponse(res, 200, 'Orders fetched successfully', {
    orders,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
  });
});

// PATCH /api/v1/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  if (!NEXT_STATUSES[order.status].includes(status)) {
    throw new AppError(`Cannot move an order from "${order.status}" to "${status}"`, 400);
  }

  order.status = status;
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.isPaid = true; // cash collected on delivery
    order.paidAt = new Date();
  }
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    await releaseStock(order.items);
  }

  await order.save();
  sendResponse(res, 200, 'Order status updated', order);
});
