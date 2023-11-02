import { Router } from 'express';
import { watchlistController } from '../controllers/watchlist.controller';

export const watchlistRouter = Router();

watchlistRouter
  .route('/:id')
  .get(watchlistController.getWatchlist)
  .delete(watchlistController.deleteWatchlist);
