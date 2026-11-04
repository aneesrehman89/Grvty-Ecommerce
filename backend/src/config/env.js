import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  // Comma separated list, e.g. "http://localhost:3000,https://grvty.vercel.app"
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  FREE_SHIPPING_THRESHOLD: Number(process.env.FREE_SHIPPING_THRESHOLD) || 5000,
  SHIPPING_FEE: Number(process.env.SHIPPING_FEE) || 250,
};

if (env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('[warn] JWT_SECRET is not set — using an insecure default.');
}

export default env;
