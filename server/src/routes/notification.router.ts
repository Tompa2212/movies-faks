import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';

export const notificationRouter = Router();

notificationRouter.patch('/:id', notificationController.markNotificationRead);
