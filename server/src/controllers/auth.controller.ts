import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/bad-request';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import UnauthenticatedError from '../errors/unauthenticated';

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError({
      message: 'Please provide email and password'
    });
  }

  const user = await authService.login(email, password);

  req.session.user = user;

  res.status(StatusCodes.OK).json({ user });
}

async function register(req: Request, res: Response) {
  const { firstName, lastName, username, password, email } = req.body;

  if (!email || !password || !firstName) {
    throw new BadRequestError({
      message: 'Please provide email, password and first name'
    });
  }

  await authService.register({
    email,
    password,
    lastName,
    username,
    firstName
  });

  return res.status(StatusCodes.OK).end();
}

async function logout(req: Request, res: Response) {
  req.session.destroy(err => {
    if (err) {
      throw err;
    }

    return res.send('OK');
  });
}

async function getSession(req: Request, res: Response) {
  if (req.session.user) {
    return res.status(StatusCodes.OK).json({ user: req.session.user });
  }

  throw new UnauthenticatedError();
}

export const authController = {
  login,
  register,
  logout,
  getSession
};
