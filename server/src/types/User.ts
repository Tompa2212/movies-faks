import { users } from '../db/schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SessionUser = Pick<User, 'email' | 'id' | 'username'>;
