import { Request, Response } from 'express';
import { movieService } from '../services/movie.service';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';

const getTop250 = async (req: Request, res: Response) => {
  const { type = 'movie' } = req.query;

  if (type !== 'movie' && type !== 'series') {
    throw new BadRequestError({
      description: `Invalid request. Type can only be movie or series.`
    });
  }

  const data = await movieService.getTop250(type);

  return res.status(StatusCodes.OK).json({ data });
};

export const movieController = {
  getTop250
};
