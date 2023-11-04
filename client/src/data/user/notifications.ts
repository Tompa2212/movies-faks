import 'server-only';
import { pool } from '@/db';

export const findNotificationyByUserId = async (userId: number) => {
  const res = await pool.query(
    `
    select
    array_to_json(
      array_agg(
        json_build_object('id', id, 'title', title, 'content', content, 'createdAt', creation_date_time, 'status', status) 
        order by creation_date_time desc
      )
    ) as notifications,
    COUNT(*) FILTER (WHERE status = 'unread') AS "unreadCount"
  from notifications
  where user_id = 5874
  group by user_id`
  );

  return res.rows[0];
};
