import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';

const LOW_STOCK_THRESHOLD = 5;

// GET /api/v1/admin/stats — numbers for the admin dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [revenue, ordersByStatus, totalProducts, totalCustomers, recentOrders, lowStock] =
    await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$variants' },
        { $match: { 'variants.stock': { $lte: LOW_STOCK_THRESHOLD } } },
        {
          $project: {
            name: 1,
            slug: 1,
            image: { $arrayElemAt: ['$images', 0] },
            variantId: '$variants._id',
            size: '$variants.size',
            color: '$variants.color',
            stock: '$variants.stock',
          },
        },
        { $sort: { stock: 1 } },
        { $limit: 10 },
      ]),
    ]);

  sendResponse(res, 200, 'Dashboard stats fetched', {
    totalRevenue: revenue[0]?.total || 0,
    totalOrders: revenue[0]?.count || 0,
    ordersByStatus: Object.fromEntries(ordersByStatus.map((s) => [s._id, s.count])),
    totalProducts,
    totalCustomers,
    recentOrders,
    lowStock,
  });
});
