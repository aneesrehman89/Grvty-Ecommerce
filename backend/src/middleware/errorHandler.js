import AppError from '../utils/AppError.js';
import env from '../config/env.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

// Translate common Mongoose / JWT errors into friendly operational errors
const normaliseError = (err) => {
  if (err.name === 'CastError') {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new AppError(`An item with this ${field} already exists`, 409);
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return new AppError(messages.join('. '), 400);
  }
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Your session has expired. Please log in again.', 401);
  }
  return err;
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const error = normaliseError(err);
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    status: error.status || 'error',
    message:
      error.isOperational || env.NODE_ENV !== 'production'
        ? error.message
        : 'Something went wrong on the server',
    errors: error.errors,
    stack: env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
