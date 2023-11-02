import BadRequestError from '../errors/bad-request';
import ForbiddenError from '../errors/forbidden';
import NotFoundError from '../errors/not-found';
import { watchlistRepository } from '../repository/watchlist.repository';

const getUserWatchlists = async (userId: number) => {
  return watchlistRepository.findWatchlistsByUserId(userId);
};

const getWatchlist = async (watchlistId: number, userId: number) => {
  const watchlist = await watchlistRepository.findWatchlistById(watchlistId);

  if (watchlist === null) {
    throw new NotFoundError({
      description: `No watchlist with id: ${watchlistId}`
    });
  }

  if (watchlist.users.findIndex(user => user.id === userId) === -1) {
    throw new ForbiddenError({
      description: 'Not allowed to access this resource'
    });
  }

  return watchlist;
};

const deleteWatchlist = async (id: number, ownerId: number) => {
  const watchlist = await watchlistRepository.findBaseWatchlistById(id);

  if (watchlist === null) {
    throw new BadRequestError({ description: `No watchlist with id ${id}` });
  }

  if (watchlist.ownerId !== ownerId) {
    throw new ForbiddenError();
  }

  await watchlistRepository.deleteWatchlist(id, ownerId);

  return watchlist;
};

export const watchlistService = {
  getUserWatchlists,
  getWatchlist,
  deleteWatchlist
};
