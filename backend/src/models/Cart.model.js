import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Cart item must reference a product'],
    },
    variantId: {
      // References the _id of a specific variant embedded inside the Product document.
      // Tells us exactly which size + color the user chose.
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
      // Snapshotted at the moment the item is added to cart.
      // Prevents a price change in the Product document from
      // silently changing what the user sees in their cart.
      type: Number,
      required: [true, 'Cart item must have a snapshotted price'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      // Null for guest carts (managed client-side via Zustand).
      // Populated once the user logs in and the guest cart is merged.
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    // Computed total kept in sync by the controller on every mutation.
    // Storing it avoids recalculating on every cart read.
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Recalculate totalPrice from the items array before every save.
// This runs automatically — the controller never sets totalPrice manually.
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;