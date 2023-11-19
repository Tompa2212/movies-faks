import { notificationRepository } from '../repository/notification.repository';
import '../listeners/notification.listener';
import { NewNotification } from '../types/Notification';

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

export const notificationService = {
  createNotifications,
  getUserNotifications
};
