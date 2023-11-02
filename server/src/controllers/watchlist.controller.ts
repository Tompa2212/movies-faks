import { Request, Response } from 'express';
import { watchlistService } from '../services/watchlist.service';
import { StatusCodes } from 'http-status-codes';

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

export const watchlistController = {
  getWatchlist,
  deleteWatchlist
};
