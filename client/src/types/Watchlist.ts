import { watchlistsTable } from '../db/schema';

export type Watchlist = typeof watchlistsTable.$inferSelect;
export type NewWatchlist = typeof watchlistsTable.$inferInsert;
