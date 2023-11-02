import { Router } from 'express';
import { userController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

userRouter.route('/:id/watchlists').get(userController.getUserWatchlists);
