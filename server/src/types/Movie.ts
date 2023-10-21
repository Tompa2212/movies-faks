import { movies } from '../db/schema';

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;
