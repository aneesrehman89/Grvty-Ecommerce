import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';

const PRODUCT_FIELDS = 'name images price slug variants isActive';

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// Shapes the cart into a flat, frontend-friendly structure that includes the
// chosen variant's size/color and its live stock. Items whose product or variant
// has been removed are dropped from the response (and from the cart).
const formatCart = async (cart) => {
  await cart.populate('items.product', PRODUCT_FIELDS);

  const valid = [];
  const items = [];

  for (const item of cart.items) {
    const product = item.product;
    const variant = product?.isActive ? product.variants.id(item.variantId) : null;
    if (!variant) continue;

    valid.push(item);
    items.push({
      id: item._id.toString(),
      productId: product._id.toString(),
      variantId: variant._id.toString(),
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      price: item.price,
      quantity: item.quantity,
    });
  }

  if (valid.length !== cart.items.length) {
    cart.items = valid;
    await cart.save();
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { id: cart._id.toString(), items, totalItems, subtotal };
};

const getProductAndVariant = async (productId, variantId) => {
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw new AppError('Product not found', 404);

  const variant = product.variants.id(variantId);
  if (!variant) throw new AppError('Product variant not found', 404);

  return { product, variant };
};

// GET /api/v1/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await findOrCreateCart(req.user._id);
  sendResponse(res, 200, 'Cart fetched successfully', await formatCart(cart));
});

// POST /api/v1/cart/items — add a variant (or increment its quantity)
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity } = req.body;
  const { product, variant } = await getProductAndVariant(productId, variantId);

  const cart = await findOrCreateCart(req.user._id);
  const existing = cart.items.find(
    (item) => item.product.toString() === productId && item.variantId.toString() === variantId
  );

  const newQty = (existing?.quantity || 0) + quantity;
  if (newQty > variant.stock) {
    throw new AppError(
      variant.stock === 0
        ? 'This size is out of stock'
        : `Only ${variant.stock} unit(s) left in stock for this size`,
      400
    );
  }

  if (existing) {
    existing.quantity = newQty;
    existing.price = product.price; // refresh snapshot
  } else {
    cart.items.push({ product: productId, variantId, quantity, price: product.price });
  }

  await cart.save();
  sendResponse(res, 200, 'Item added to cart', await formatCart(cart));
});

// PATCH /api/v1/cart/items/:itemId — set quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await findOrCreateCart(req.user._id);

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new AppError('Cart item not found', 404);

  const { variant } = await getProductAndVariant(item.product, item.variantId);
  if (quantity > variant.stock) {
    throw new AppError(`Only ${variant.stock} unit(s) available for this size`, 400);
  }

  item.quantity = quantity;
  await cart.save();
  sendResponse(res, 200, 'Cart item updated', await formatCart(cart));
});

// DELETE /api/v1/cart/items/:itemId
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await findOrCreateCart(req.user._id);

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new AppError('Cart item not found', 404);

  item.deleteOne();
  await cart.save();
  sendResponse(res, 200, 'Item removed from cart', await formatCart(cart));
});

// DELETE /api/v1/cart/clear
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await findOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  sendResponse(res, 200, 'Cart cleared', await formatCart(cart));
});

// POST /api/v1/cart/merge — merge a guest (local) cart into the user's cart on login.
// Quantities are capped at available stock instead of failing the whole merge.
export const mergeCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const cart = await findOrCreateCart(req.user._id);

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  for (const incoming of items) {
    const product = productMap.get(incoming.productId);
    const variant = product?.variants.id(incoming.variantId);
    if (!variant || variant.stock === 0) continue;

    const existing = cart.items.find(
      (item) =>
        item.product.toString() === incoming.productId &&
        item.variantId.toString() === incoming.variantId
    );

    if (existing) {
      existing.quantity = Math.min(existing.quantity + incoming.quantity, variant.stock);
    } else {
      cart.items.push({
        product: product._id,
        variantId: variant._id,
        quantity: Math.min(incoming.quantity, variant.stock),
        price: product.price,
      });
    }
  }

  await cart.save();
  sendResponse(res, 200, 'Cart merged', await formatCart(cart));
});
