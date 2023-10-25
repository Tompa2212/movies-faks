import { omit } from 'lodash';
import User from '../entities/User';
import UnauthenticatedError from '../errors/unauthenticated';
import { userRepository } from '../repository/user.repository';
import { hash, hashCompare } from '../utils/hashing';

const login = async (email: string, password: string) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new UnauthenticatedError({ message: 'Invalid credentials' });
  }

  const isValidPassword = hashCompare(user.password, password);

  if (!isValidPassword) {
    throw new UnauthenticatedError({ message: 'Invalid credentials' });
  }

  return omit(user, ['password', 'firstName', 'lastName']);
};

const register = async ({
  email,
  password,
  firstName,
  lastName,
  username
}: Omit<User, 'id'>) => {
  const hashedPassword = await hash(password);

  const newUser = await userRepository.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username
  });

  return omit(newUser, ['password', 'firstName', 'lastName']);
};

export const authService = { login, register };
