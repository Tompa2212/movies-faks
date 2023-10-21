import authController from '../controllers/auth.controller';
import authService from '../services/auth.service';
import userRepository from '../repository/user.repository';
import { pool } from '../db';
import { pipe } from 'lodash/fp';

export const generateInstance = () => {
  return pipe(userRepository, authService, authController)(pool);
};
