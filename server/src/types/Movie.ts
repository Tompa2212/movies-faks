import { moviesTable } from '../db/schema';

export type Movie = typeof moviesTable.$inferSelect;
export type NewMovie = typeof moviesTable.$inferInsert;
