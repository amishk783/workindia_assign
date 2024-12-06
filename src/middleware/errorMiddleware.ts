import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response) => {
  // If the error is an instance of AppError, use its properties
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // For unknown errors (programmer errors)
  console.error(err); // Log the error for debugging purposes

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};
