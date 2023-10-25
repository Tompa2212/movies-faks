import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/custom-error';
import { DatabaseError } from 'pg';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';

const errorHandlerMiddleware = (
  err: Error | DatabaseError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    errors: [{ message: 'Something went wrong' }]
  };

  if (err instanceof DatabaseError) {
    if (err.code === '23505') {
      error = new BadRequestError({
        message: err.detail?.replace(/[\(\)]/g, '')
      });
    }
  }

  if (err instanceof CustomError) {
    error = err;
  }

  return res.status(error.statusCode).json({ errors: error.errors });
};

export default errorHandlerMiddleware;
