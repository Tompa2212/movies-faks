import { Request, Response } from 'express';
import { ratingService } from '../services/rating.service';
import { zParse } from '../utils/z-parse';
import { createRatingSchema } from '../schema/rating.schema';
import { StatusCodes } from 'http-status-codes';

export const createRating = async (req: Request, res: Response) => {
  const {
    body: { movieId, rating }
  } = await zParse(createRatingSchema, req);

  const created = await ratingService.createRating({
    rating,
    movieId,
    userId: req.user.id
  });

  return res.status(StatusCodes.CREATED).json({ data: created });
};

export const deleteRating = async (req: Request, res: Response) => {
  const { id } = req.params;

  await ratingService.deleteRating(parseInt(id));

  return res.status(StatusCodes.OK).end();
};

export const ratingController = {
  createRating,
  deleteRating
};
