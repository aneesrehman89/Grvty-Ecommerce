import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/env.js';

export const signToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
};

// Requires a valid JWT — attaches the user document to req.user
export const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new AppError('You are not logged in. Please log in to continue.', 401);
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  req.user = user;
  next();
});

// Role guard — use after protect, e.g. restrictTo('admin')
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
