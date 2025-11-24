import { errorResponse } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return errorResponse(res, 'Duplicate entry. Data already exists.', 409);
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse(res, 'Referenced data not found.', 404);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired.', 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation failed.', 400, err.errors);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return errorResponse(res, message, statusCode);
};

export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};
