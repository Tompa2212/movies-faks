import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';

export const notificationRouter = Router();

notificationRouter.patch('/:id', notificationController.markNotificationRead);

notificationRouter.get('/', notificationController.getUserNotifications);
notificationRouter.post(
  '/seen',
  notificationController.markAllUserNotificationsSeen
);
