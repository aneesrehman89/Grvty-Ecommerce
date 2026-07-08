import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRoutes from './routes/category.routes.js'
import productRoutes  from './routes/product.routes.js'
import cartRoutes from '../src/routes/cart.routes.js'

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/cart', cartRoutes)


// Global Error Handler // send responce to frontend
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong on the server',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});


export default app;