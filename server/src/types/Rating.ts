import { ratingsTable } from '../db/schema';

export type Rating = typeof ratingsTable.$inferSelect;
export type NewRating = typeof ratingsTable.$inferInsert;
