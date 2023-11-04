import { Router } from 'express';
import { watchlistController } from '../controllers/watchlist.controller';

export const watchlistRouter = Router();

watchlistRouter
  .route('/:id')
  .get(watchlistController.getWatchlist)
  .delete(watchlistController.deleteWatchlist);

watchlistRouter.post('/:id/movies', watchlistController.addMovie);
watchlistRouter.delete('/:id/movies/:movieId', watchlistController.removeMovie);

watchlistRouter.post('/:id/users', watchlistController.addUser);
watchlistRouter.delete('/:id/users/:userId', watchlistController.removeUser);
