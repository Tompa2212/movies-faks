import { pgRepository } from './base-repository/pg.repository';
import { db, pool } from '../db';
import { NewNotification, Notification } from '../types/Notification';
import { notificationsTable } from '../db/schema';

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
    where  notifier_id = $1`,
      [userId]
    );

    return res.rows;
  };

  const insertManyNotifications = async (data: NewNotification[]) => {
    const res = await db.insert(notificationsTable).values(data).returning();

    return res[0];
  };

  return {
    ...base,
    findNotificationyByUserId,
    insertManyNotifications
  };
}

export const notificationRepository = makeNotificationRepository();
