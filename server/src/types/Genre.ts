import { genresTable } from '../db/schema';

export type Genre = typeof genresTable.$inferSelect;
