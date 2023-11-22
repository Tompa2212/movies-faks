import { NextFunction, Request, Response } from 'express';
import UnauthenticatedError from '../errors/unauthenticated';
import { verifyAccessToken } from '../utils/jwt';

export const isAuthenticated = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // const authorization = req.headers.authorization;

  // if (authorization) {
  //   const token = authorization.split(' ')[1];

  //   try {
  //     const user = verifyAccessToken(token);
  //     req.user = user;
  //     return next();
  //   } catch (error) {
  //     // throw new UnauthenticatedError();
  //   }
  // }

  if (req.session.user) {
    req.user = req.session.user;
    return next();
  }

  throw new UnauthenticatedError();
};
