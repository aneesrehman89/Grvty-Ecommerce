import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const PRODUCT_TAGS = ['best-seller', 'new-drop', 'summer-edit', 'featured'];

// One size+color combination with its own stock count.
// Embedded on the product — no separate collection needed for a catalog this size.
const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: [true, 'Variant size is required'],
      enum: SIZES,
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
    sku: {
      type: String,
      trim: true,
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
    details: {
      // Bullet points shown in the "Details & Fit" accordion
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      // Optional original price, used to show a "sale" strike-through
      type: Number,
      min: 0,
      default: null,
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
      type: [{ type: String, enum: PRODUCT_TAGS }],
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
    soldCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true, // soft-disable a product without deleting it
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('totalStock').get(function () {
  return (this.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
});

productSchema.virtual('inStock').get(function () {
  return (this.variants || []).some((v) => v.stock > 0);
});

// Text index powers search; compound index speeds up the shop listing.
productSchema.index({ name: 'text', description: 'text' }, { weights: { name: 5, description: 1 } });
productSchema.index({ isActive: 1, category: 1, createdAt: -1 });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
