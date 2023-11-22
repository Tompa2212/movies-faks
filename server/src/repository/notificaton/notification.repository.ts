import { pgRepository } from '../base-repository/pg.repository';
import { db, pool } from '../../db';
import { NewNotification, Notification } from '../../types/Notification';
import { notificationsTable } from '../../db/schema';

function makeNotificationRepository() {
  const base = pgRepository<Notification>({
    table: 'notifications',
    primaryKey: 'id',
    mapping: {
      id: 'id',
      notifierId: 'notifier_id',
      actorId: 'actor_id',
      attributes: 'attributes',
      creationDateTime: 'creation_date_time',
      status: 'status',
      seen: 'seen',
      type: 'type'
    }
  });

  const findNotificationyByUserId = async (userId: number) => {
    const res = await pool.query<Notification>(
      `
    select
      ${base.allColumns}
    from ${base.table}
    where notifier_id = $1
    order by creation_date_time desc`,
      [userId]
    );

    return res.rows;
  };

  const insertManyNotifications = async (data: NewNotification[]) => {
    const res = await db.insert(notificationsTable).values(data).returning();

    return res;
  };

  const markUsersNotificationsSeen = async (userId: number) => {
    const res = await pool.query<Notification>(
      `
      UPDATE notifications
      SET seen = true
      WHERE notifier_id = $1 AND
      status = 'unread'
      RETURNING ${base.allColumns}
    `,
      [userId]
    );

    return res.rows;
  };

  const markUserNotificationRead = async (
    notificationId: number,
    userId: number
  ) => {
    const res = await pool.query<Notification>(
      `
      UPDATE notifications
      SET status = 'read'
      WHERE id = $1 AND
      status = 'unread' AND
      notifier_id = $2
      RETURNING ${base.allColumns}
    `,
      [notificationId, userId]
    );

    return res.rows[0];
  };

  return {
    ...base,
    findNotificationyByUserId,
    insertManyNotifications,
    markUsersNotificationsSeen,
    markUserNotificationRead
  };
}

export const notificationRepository = makeNotificationRepository();
