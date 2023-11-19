import { omit } from 'lodash';
import NotFoundError from '../errors/not-found';
import { userRepository } from '../repository/user.repository';
import { User } from '../types/User';

const getUser = async (id: number) => {
  const user = await userRepository.findOneById(id);

  if (!user) {
    throw new NotFoundError({ description: `No user with id ${id}` });
  }

  return omit(user, 'password');
};

const updateUser = async (id: number, data: Partial<User>) => {
  const updatedUser = await userRepository.updateUser(id, data);

  if (!updatedUser) {
    throw new NotFoundError({
      description: `No user with id ${id}`
    });
  }

  return omit(updatedUser, 'password');
};

const deleteUser = async (id: number) => {
  const deletedUser = await userRepository.deleteUser(id);

  if (!deletedUser) {
    throw new NotFoundError({
      description: `No user with id ${id}`
    });
  }

  return omit(deletedUser, 'password');
};

const searchUsersByEmail = async (email: string) => {
  return userRepository.findManyByEmail(email);
};

export const userService = {
  getUser,
  updateUser,
  deleteUser,
  searchUsersByEmail
};
