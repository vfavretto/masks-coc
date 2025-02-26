import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../../../shared/errors/ApplicationError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error'
  });
};