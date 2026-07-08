import mongoose from 'mongoose';

// One size+color combination with its own stock count.
// Embedded directly on the product — no separate collection needed
// for a catalog this size.
const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: [true, 'Variant size is required'],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    color: {
      type: String,
      required: [true, 'Variant color is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
  },
  { _id: true } // each variant gets its own _id so the cart can reference a specific one
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Product must have at least one image',
      },
    },
    variants: {
      type: [variantSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Product must have at least one variant',
      },
    },
    tags: {
      type: [String],
      enum: ['best-seller', 'new-drop', 'summer-edit', 'featured'],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true, // soft-disable a product without deleting it
    },
  },
  { timestamps: true }
);

// Text index powers /products/search?q= ; slug index powers /products/:slug lookups
productSchema.index({ name: 'text' });

// Auto-generate the slug from the name whenever it changes,
// so the controller never has to set it manually.
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;