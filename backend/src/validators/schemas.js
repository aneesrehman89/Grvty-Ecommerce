import { z } from 'zod';
import { SIZES, PRODUCT_TAGS } from '../models/Product.model.js';
import { ORDER_STATUSES } from '../models/Order.model.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

// ---------- Auth ----------
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().trim().toLowerCase().email('Please provide a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  phone: z.string().trim().max(20).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100),
});

// ---------- Cart ----------
export const addCartItemSchema = z.object({
  productId: objectId,
  variantId: objectId,
  quantity: z.coerce.number().int().min(1).max(20).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').max(20),
});

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectId,
        variantId: objectId,
        quantity: z.coerce.number().int().min(1).max(20),
      })
    )
    .max(50),
});

// ---------- Orders ----------
const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{6,18}$/, 'Please provide a valid phone number'),
  address: z.string().trim().min(5, 'Address is required').max(200),
  city: z.string().trim().min(2, 'City is required').max(60),
  postalCode: z.string().trim().max(12).optional().default(''),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.literal('COD').default('COD'),
  notes: z.string().trim().max(500).optional().default(''),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

// ---------- Reviews ----------
export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(3, 'Review is too short').max(1000),
});

// ---------- Products (admin) ----------
const variantSchema = z.object({
  _id: objectId.optional(),
  size: z.enum(SIZES),
  color: z.string().trim().min(1),
  stock: z.coerce.number().int().min(0),
  sku: z.string().trim().optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  details: z.array(z.string().trim().min(1)).optional().default([]),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  category: objectId,
  images: z.array(z.string().trim().url('Each image must be a valid URL')).min(1),
  variants: z.array(variantSchema).min(1, 'Add at least one variant'),
  tags: z.array(z.enum(PRODUCT_TAGS)).optional().default([]),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();

export const updateStockSchema = z.object({
  variants: z
    .array(
      z.object({
        variantId: objectId,
        stock: z.coerce.number().int().min(0),
      })
    )
    .min(1),
});

// ---------- Categories (admin) ----------
export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional(),
  image: z.string().trim().url(),
  parent: objectId.nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = categorySchema.partial();
