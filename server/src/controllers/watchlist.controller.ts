import { Request, Response } from 'express';
import { watchlistService } from '../services/watchlist.service';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';

const getWatchlist = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await watchlistService.getWatchlist(parseInt(id), req.user.id);

  return res.status(StatusCodes.OK).json({ data });
};

const deleteWatchlist = async (req: Request, res: Response) => {
  const { id } = req.params;

  await watchlistService.deleteWatchlist(parseInt(id), req.user.id);

  return res.status(StatusCodes.OK);
};

const addUser = (req: Request, res: Response) => {
  return res.send('');
};
const removeUser = (req: Request, res: Response) => {
  return res.send('');
};

const addMovie = async (req: Request, res: Response) => {
  const { id: watchlistId } = req.params;
  const { movieId } = req.body;

  if (typeof movieId !== 'number') {
    throw new BadRequestError({
      description: `Invalid movieId type. Type should be number.`
    });
  }

  const data = await watchlistService.addMovie(
    parseInt(watchlistId),
    movieId,
    req.user
  );

  return res.status(StatusCodes.CREATED).json({ data });
};
const removeMovie = async (req: Request, res: Response) => {
  const { id: watchlistId, movieId } = req.params;

  const data = await watchlistService.removeMovie(
    parseInt(watchlistId),
    parseInt(movieId),
    req.user
  );

  return res.status(StatusCodes.OK).json({ data });
};

export const watchlistController = {
  getWatchlist,
  deleteWatchlist,
  addUser,
  removeUser,
  addMovie,
  removeMovie
};
