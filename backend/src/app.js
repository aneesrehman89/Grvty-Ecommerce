import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Behind Vercel's proxy — needed so rate limiting sees the real client IP
app.set('trust proxy', 1);

// CLIENT_URL can hold several comma-separated origins (local + Vercel)
const allowedOrigins = env.CLIENT_URL.split(',').map((o) => o.trim().replace(/\/$/, ''));

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server calls (no Origin header) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({ name: 'GRVTY API', version: 'v1', docs: '/api/v1/health' });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Ensure a DB connection exists (cached) before any API route runs.
// Locally this resolves instantly after the first connect; on Vercel it
// reuses the connection across warm invocations.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
