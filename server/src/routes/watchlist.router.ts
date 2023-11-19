import { Router } from 'express';
import { watchlistController } from '../controllers/watchlist.controller';

export const watchlistRouter = Router();

watchlistRouter.post('/', watchlistController.createWatchlist);

watchlistRouter
  .route('/:id')
  .get(watchlistController.getWatchlist)
  .delete(watchlistController.deleteWatchlist);

watchlistRouter.post('/:id/movies', watchlistController.addMovie);
watchlistRouter.delete('/:id/movies/:movieId', watchlistController.removeMovie);

watchlistRouter.delete('/:id/users/:userId', watchlistController.removeUser);
