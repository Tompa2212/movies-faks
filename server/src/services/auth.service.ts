import { omit, pick } from 'lodash';
import { NewUser } from '../types/User';
import UnauthenticatedError from '../errors/unauthenticated';

import { hash, hashCompare } from '../utils/hashing';
import { authRepository } from '../repository/auth.repository';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from '../utils/jwt';
import { compareSync, hashSync } from 'bcrypt';

const login = async (email: string, password: string) => {
  const user = await authRepository.findOneByEmail(email);

  if (!user) {
    throw new UnauthenticatedError({ description: 'Invalid credentials' });
  }

  const isValidPassword = await hashCompare(password, user.password!);

  if (!isValidPassword) {
    throw new UnauthenticatedError({ description: 'Invalid credentials' });
  }

  const userDto = pick(user, ['id', 'email', 'username']);

  return {
    user: userDto,
    accessToken: createAccessToken(userDto),
    refreshToken: createRefreshToken(userDto)
  };
};

const register = async ({
  email,
  password,
  firstName,
  lastName,
  username
}: NewUser) => {
  const hashedPassword = await hash(password!);

  const newUser = await authRepository.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username
  });

  return pick(newUser, ['id', 'email', 'username']);
};

const refreshToken = (token: string) => {
  try {
    const payload = verifyRefreshToken(token);

    return {
      user: payload,
      accessToken: createAccessToken(payload),
      refreshToken: createRefreshToken(payload)
    };
  } catch (error) {
    // console.log(error);
    throw new UnauthenticatedError();
  }
};

export const authService = { login, register, refreshToken };
