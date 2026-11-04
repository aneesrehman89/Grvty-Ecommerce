import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';
import { signToken } from '../middleware/auth.js';

const sendAuth = (res, statusCode, message, user) => {
  const token = signToken(user._id);
  sendResponse(res, statusCode, message, { user, token });
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.exists({ email });
  if (exists) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({ name, email, password });
  sendAuth(res, 201, 'Account created successfully', user);
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  sendAuth(res, 200, 'Logged in successfully', user);
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'Current user fetched', req.user);
});

// PATCH /api/v1/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  await req.user.save();
  sendResponse(res, 200, 'Profile updated', req.user);
});

// PATCH /api/v1/auth/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();
  sendAuth(res, 200, 'Password updated', user);
});
