import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { notificationService } from '../services/notification.service';

const markNotificationRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = await notificationService.markUserNotificationRead(
    parseInt(id),
    req.session.user.id
  );
  return res.status(StatusCodes.OK).json({ data: notification });
};

export const notificationController = {
  markNotificationRead
};
