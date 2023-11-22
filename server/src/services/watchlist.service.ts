import BadRequestError from '../errors/bad-request';
import ForbiddenError from '../errors/forbidden';
import NotFoundError from '../errors/not-found';
import { watchlistMovieRepository } from '../repository/watchlist-movie.repository';
import { watchlistUserRepository } from '../repository/watchlist-user.repository';
import { watchlistRepository } from '../repository/watchlist.repository';
import { SessionUser } from '../types/User';

const getUserWatchlists = async (userId: number) => {
  return watchlistRepository.findWatchlistsByUserId(userId);
};

const getWatchlist = async (watchlistId: number, userId: number) => {
  const watchlist = await watchlistRepository.findWatchlistWithUsersAndMovies(
    watchlistId
  );

  if (watchlist === null) {
    throw new NotFoundError({
      description: `No watchlist with id: ${watchlistId}`
    });
  }

  if (watchlist.users.findIndex((user) => user.id === userId) === -1) {
    throw new ForbiddenError({
      description: 'Not allowed to access this resource'
    });
  }

  return watchlist;
};

const createWatchlist = async (title: string, ownerId: number) => {
  const watchlist = await watchlistRepository.create(title, ownerId);
  await watchlistUserRepository.addUsersToWatchlist([
    { watchlistId: watchlist.id, userId: ownerId }
  ]);

  return watchlist;
};

const deleteWatchlist = async (id: number, ownerId: number) => {
  const watchlist = await watchlistRepository.findById(id);

  if (watchlist === null) {
    throw new BadRequestError({ description: `No watchlist with id ${id}` });
  }

  if (watchlist.ownerId !== ownerId) {
    throw new ForbiddenError();
  }

  await watchlistRepository.deleteById(id);

  return watchlist;
};

const addUsers = async (watchlistId: number, users: number[]) => {
  const rows = await watchlistUserRepository.addUsersToWatchlist(
    users.map((userId) => ({ watchlistId, userId }))
  );

  return rows;
};

const removeUser = async (watchlistId: number, userId: number) => {
  return;
};

const addMovie = async (
  watchlistId: number,
  movieId: number,
  authUser: SessionUser
) => {
  const users = await watchlistUserRepository.findWatchlistUsers(watchlistId);

  if (users.findIndex((user) => user.userId === authUser.id) === -1) {
    throw new ForbiddenError();
  }

  const movie = await watchlistMovieRepository.insertMovieWatchlist(
    watchlistId,
    movieId,
    authUser.id
  );

  return movie;
};

const removeMovie = async (
  watchlistId: number,
  movieId: number,
  authUser: SessionUser
) => {
  const watchlistMovie =
    await watchlistMovieRepository.findWatchlistMovieAndWatchlistOwner(
      watchlistId,
      movieId
    );

  if (!watchlistMovie) {
    throw new NotFoundError({
      description: `Movie with id: ${movieId} is not in the watchlist.`
    });
  }

  if (
    watchlistMovie.watchlistOwnerId !== authUser.id &&
    watchlistMovie.addedBy !== authUser.id
  ) {
    throw new ForbiddenError();
  }

  const movie = await watchlistMovieRepository.removeMovieFromWatchlist(
    watchlistId,
    movieId
  );

  return movie;
};

export const watchlistService = {
  getUserWatchlists,
  getWatchlist,
  createWatchlist,
  deleteWatchlist,
  addUsers,
  removeUser,
  addMovie,
  removeMovie
};
