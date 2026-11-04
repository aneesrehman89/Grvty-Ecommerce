import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Cart item must reference a product'],
    },
    variantId: {
      // _id of a variant embedded inside the Product document (size + color).
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Cart item must reference a product variant'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    price: {
      // Snapshotted when the item is added so a later price change
      // doesn't silently change what the user sees in their cart.
      type: Number,
      required: [true, 'Cart item must have a snapshotted price'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    // Guest carts live client-side (Zustand) and are merged on login,
    // so every server-side cart belongs to exactly one user.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Recalculate totalPrice from the items array before every save.
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
