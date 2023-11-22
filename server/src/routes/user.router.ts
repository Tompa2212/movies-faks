import { Router } from 'express';
import { userController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

userRouter.get('/search/:email', userController.searchUsersByEmail);

userRouter.route('/:id/watchlists').get(userController.getUserWatchlists);
userRouter.route('/:id/notifications').get(userController.getUserNotifications);

userRouter.post(
  '/:id/notifications/seen',
  userController.markAllUserNotificationsSeen
);
