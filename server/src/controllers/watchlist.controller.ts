import { Request, Response } from 'express';
import { watchlistService } from '../services/watchlist.service';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';

const getWatchlist = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await watchlistService.getWatchlist(parseInt(id), req.user.id);

  return res.status(StatusCodes.OK).json({ data });
};

const createWatchlist = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    throw new BadRequestError({
      description: 'Please provide watchlist title.'
    });
  }

  if (typeof title !== 'string') {
    throw new BadRequestError({
      description: 'Invalid data type for watchlist title. Provide string.'
    });
  }

  const watchlist = await watchlistService.createWatchlist(
    title,
    req.session.user.id
  );

  return res.status(StatusCodes.CREATED).json({ data: watchlist });
};

const deleteWatchlist = async (req: Request, res: Response) => {
  const { id } = req.params;

  await watchlistService.deleteWatchlist(parseInt(id), req.user.id);

  return res.status(StatusCodes.OK).end();
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
  createWatchlist,
  getWatchlist,
  deleteWatchlist,
  removeUser,
  addMovie,
  removeMovie
};
