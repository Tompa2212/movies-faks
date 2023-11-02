import { pgRepository } from './base-repository/pg.repository';
import { pool } from '../db';
import { Notification } from '../types/Notification';

function makeNotificationRepository() {
  const base = pgRepository<Notification>({
    table: 'users',
    primaryKey: 'id',
    mapping: {
      id: 'id',
      userId: 'user_id',
      title: 'title',
      content: 'conent',
      creationDateTime: 'creation_date_time',
      status: 'status',
      type: 'type'
    }
  });

  const findNotificationyByUserId = async (userId: number) => {
    const res = await pool.query(
      `
    select
      array_to_json(
        array_agg(
          json_build_object(
            'id', id,
            'title', title,
            'content', content,
            'createdAt', creation_date_time
            'status', status)
          order by creation_date_time desc
        )
      ) as notifications,
      COUNT(*) FILTER (WHERE status = 'unread') AS "unreadCount"
    from notifications
    where user_id = 5874
    group by user_id;`,
      [userId]
    );

    return res.rows;
  };

  return {
    ...base,
    findNotificationyByUserId
  };
}

export const notificationRepository = makeNotificationRepository();
