import { notificationRepository } from '../repository/notificaton/notification.repository';
import '../listeners/notification.listener';
import { NewNotification } from '../types/Notification';
import NotFoundError from '../errors/not-found';

const getUserNotifications = async (userId: number) => {
  const notifications = await notificationRepository.findNotificationyByUserId(
    userId
  );

  return notifications;
};

const createNotifications = async (data: NewNotification[]) => {
  if (!data.length) {
    return data;
  }

  const notification = await notificationRepository.insertManyNotifications(
    data
  );

  return notification;
};

const markUsersNotificationsSeen = async (userId: number) => {
  await notificationRepository.markUsersNotificationsSeen(userId);

  return true;
};

const markUserNotificationRead = async (
  notificationId: number,
  userId: number
) => {
  const notification = await notificationRepository.markUserNotificationRead(
    notificationId,
    userId
  );

  if (!notification) {
    throw new NotFoundError();
  }

  return notification;
};

export const notificationService = {
  createNotifications,
  getUserNotifications,
  markUsersNotificationsSeen,
  markUserNotificationRead
};
