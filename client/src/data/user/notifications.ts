import 'server-only';
import { pool } from '@/db';

export const findNotificationyByUserId = async (userId: number) => {
  return {
    notifications: [],
    unreadCount: 0
  };
};
