import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true }, // reviewer display name snapshot
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    isVerifiedBuyer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Keep Product.rating / Product.numReviews in sync. Called (and awaited) by the
// controller after every create/delete so serverless functions don't exit early.
reviewSchema.statics.recalculateRating = async function (productId) {
  const [stats] = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', count: { $sum: 1 }, avg: { $avg: '$rating' } } },
  ]);

  await mongoose.model('Product').findByIdAndUpdate(productId, {
    numReviews: stats?.count || 0,
    rating: stats ? Math.round(stats.avg * 10) / 10 : 0,
  });
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
