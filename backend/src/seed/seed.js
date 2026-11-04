/**
 * Seeds the database with categories, products and an admin + demo customer.
 *
 *   npm run seed          → resets categories & products, upserts users
 *   npm run seed:destroy  → removes all seeded data (catalog, carts, orders, reviews)
 */
import mongoose from 'mongoose';
import '../config/env.js';
import connectDB from '../config/db.js';
import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Cart from '../models/Cart.model.js';
import Order from '../models/Order.model.js';
import Review from '../models/Review.model.js';
import { categories, products } from './data.js';

const users = [
  {
    name: 'GRVTY Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@grvty.store',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin12345',
    role: 'admin',
  },
  {
    name: 'Demo Customer',
    email: process.env.SEED_USER_EMAIL || 'demo@grvty.store',
    password: process.env.SEED_USER_PASSWORD || 'Demo12345',
    role: 'user',
  },
];

const upsertUser = async ({ password, ...data }) => {
  let user = await User.findOne({ email: data.email });
  if (!user) user = new User(data);
  Object.assign(user, data);
  user.password = password; // re-hashed by the pre-save hook
  await user.save();
  return user;
};

const importData = async () => {
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Review.deleteMany({}),
  ]);

  // create() (unlike insertMany) runs the save hooks that build slugs
  const createdCategories = await Category.create(categories);
  const categoryIds = Object.fromEntries(createdCategories.map((c) => [c.name, c._id]));

  // Stagger createdAt so "newest" sorting has a stable, meaningful order
  const now = Date.now();
  const docs = products.map((p, i) => ({
    ...p,
    category: categoryIds[p.category],
    createdAt: new Date(now - i * 60 * 60 * 1000),
  }));
  await Product.create(docs);

  for (const user of users) await upsertUser(user);
  await Promise.all([Product.syncIndexes(), Category.syncIndexes()]);

  console.log(`Seeded ${createdCategories.length} categories, ${docs.length} products, ${users.length} users`);
};

const destroyData = async () => {
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('All catalog, cart, order and review data removed');
};

const run = async () => {
  try {
    await connectDB();
    if (process.argv.includes('--destroy')) await destroyData();
    else await importData();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
