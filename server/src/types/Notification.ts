import { notificationTypeEnum, notificationsTable } from '../db/schema';

export type Notification = typeof notificationsTable.$inferSelect;
export type NewNotification = typeof notificationsTable.$inferInsert;

export type NotificationType = typeof notificationTypeEnum;
