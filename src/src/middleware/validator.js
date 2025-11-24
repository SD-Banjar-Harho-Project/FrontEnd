import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseHelper.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return errorResponse(res, 'Validation failed', 422, formattedErrors);
  }
  
  next();
};
