import Product from '../models/Product.model.js';
import AppError from './AppError.js';

/**
 * Atomically decrements stock for each line item. Each update only matches
 * when the variant still has enough stock, so two shoppers can never buy the
 * last unit at the same time. If any line fails, the already-reserved lines are
 * rolled back. (Works on standalone MongoDB as well as Atlas replica sets.)
 */
export const reserveStock = async (items) => {
  const reserved = [];

  for (const item of items) {
    const result = await Product.updateOne(
      {
        _id: item.product,
        isActive: true,
        variants: { $elemMatch: { _id: item.variantId, stock: { $gte: item.quantity } } },
      },
      {
        $inc: { 'variants.$.stock': -item.quantity, soldCount: item.quantity },
      }
    );

    if (result.modifiedCount === 0) {
      await releaseStock(reserved);
      throw new AppError(
        `"${item.name}" (${item.size} / ${item.color}) no longer has enough stock. Please update your cart.`,
        409
      );
    }

    reserved.push(item);
  }
};

// Returns stock for the given line items — used on rollback and order cancellation
export const releaseStock = async (items) => {
  if (!items.length) return;

  await Product.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { _id: item.product, 'variants._id': item.variantId },
        update: { $inc: { 'variants.$.stock': item.quantity, soldCount: -item.quantity } },
      },
    }))
  );
};
