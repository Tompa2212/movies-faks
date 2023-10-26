import { omit } from 'lodash';
import { NewUser } from '../types/User';
import UnauthenticatedError from '../errors/unauthenticated';

import { hash, hashCompare } from '../utils/hashing';
import { authRepository } from '../repository/auth.repository';

const login = async (email: string, password: string) => {
  const user = await authRepository.findOneByEmail(email);

  if (!user) {
    throw new UnauthenticatedError({ description: 'Invalid credentials' });
  }

  const isValidPassword = hashCompare(user.password, password);

  if (!isValidPassword) {
    throw new UnauthenticatedError({ description: 'Invalid credentials' });
  }

  return omit(user, ['password']);
};

const register = async ({
  email,
  password,
  firstName,
  lastName,
  username
}: NewUser) => {
  const hashedPassword = await hash(password);

  const newUser = await authRepository.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username
  });

  return omit(newUser, ['password']);
};

export const authService = { login, register };
