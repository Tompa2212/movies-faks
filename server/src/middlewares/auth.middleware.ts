import { NextFunction, Request, Response } from 'express';
import UnauthenticatedError from '../errors/unauthenticated';

export const isAuthenticated = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    return next();
  }

  throw new UnauthenticatedError();
};
