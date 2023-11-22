import { Request, Response } from 'express';
import { movieService } from '../services/movie.service';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';
import { number } from 'zod';
import { zParse } from '../utils/z-parse';
import { movieSearchSchema } from '../schema/movie.schema';

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

const getTitle = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userId = req.session?.user?.id;
  const title = await movieService.getTitleById(parseInt(id), userId);

  return res.status(StatusCodes.OK).json({ data: title });
};

const searchMovies = async (req: Request, res: Response) => {
  const {
    query: { title, page = 0, size = 20 }
  } = await zParse(movieSearchSchema, req);

  if (typeof title !== 'string') {
    throw new BadRequestError({
      description: 'Title should be type of string.'
    });
  }

  const data = await movieService.searchByText(title, { page, size });

  return res.status(StatusCodes.OK).json({ data });
};

export const movieController = {
  getTop250,
  getTitle,
  searchMovies
};
