import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';

// Helper: find a cart by userId, or create a fresh one if it doesn't exist yet.
// Centralised here so every handler below uses the same logic.
const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name images price slug'
  );
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// GET /api/v1/cart - Get current authenticated user's cart
export const getCart = asyncHandler(async (req, res) => {
  // req.user._id comes from the auth middleware — hardcoded for testing until Phase 3

    req.user = { _id: '6634c9b5fc13ae1a2b000001' };
  const cart = await findOrCreateCart(req.user._id);
  sendResponse(res, 200, 'Cart fetched successfully', cart);
});

 
  
// POST /api/v1/cart/items - Add a product variant to the cart (or increment qty if already present)
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
 
  if (!productId || !variantId) {
    throw new AppError('productId and variantId are required', 400);
  }
 
  // Confirm the product exists and pull the variant from it
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
 
  const variant = product.variants.id(variantId);
  if (!variant) {
    throw new AppError('Product variant not found', 404);
  }
 
  if (variant.stock < quantity) {
    throw new AppError(
      `Only ${variant.stock} unit(s) left in stock for this variant`,
      400
    );
  }
 
  const cart = await findOrCreateCart(req.user._id);
 
  // Check if this exact variant is already in the cart
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variantId.toString() === variantId
  );
 
  if (existingItem) {
    // Already in cart — just increment quantity
    const newQty = existingItem.quantity + Number(quantity);
    if (newQty > variant.stock) {
      throw new AppError(
        `Cannot add more — only ${variant.stock} unit(s) in stock`,
        400
      );
    }
    existingItem.quantity = newQty;
  } else {
    // New item — push with price snapshotted from Product right now
    cart.items.push({
      product: productId,
      variantId,
      quantity: Number(quantity),
      price: product.price, // snapshot
    });
  }
 
  await cart.save(); // triggers pre('save') to recalculate totalPrice
 
  await cart.populate('items.product', 'name images price slug');
  sendResponse(res, 200, 'Item added to cart', cart);
});

// PATCH /api/v1/cart/items/:itemId - Update quantity of a specific cart item
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
 
  if (!quantity || quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }
 
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }
 
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new AppError('Cart item not found', 404);
  }
 
  // Validate against current stock before updating
  const product = await Product.findById(item.product);
  const variant = product?.variants.id(item.variantId);
 
  if (variant && quantity > variant.stock) {
    throw new AppError(
      `Only ${variant.stock} unit(s) available for this variant`,
      400
    );
  }
 
  item.quantity = Number(quantity);
  await cart.save();
 
  await cart.populate('items.product', 'name images price slug');
  sendResponse(res, 200, 'Cart item updated', cart);
});

// DELETE /api/v1/cart/items/:itemId - Remove a single item from the cart
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }
 
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new AppError('Cart item not found', 404);
  }
 
  item.deleteOne();
  await cart.save();
 
  await cart.populate('items.product', 'name images price slug');
  sendResponse(res, 200, 'Item removed from cart', cart);
});

// DELETE /api/v1/cart/clear - Empty the entire cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }
 
  cart.items = [];
  await cart.save();
 
  sendResponse(res, 200, 'Cart cleared', cart);
});