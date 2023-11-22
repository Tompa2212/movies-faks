import NotFoundError from '../errors/not-found';
import { ratingRepository } from '../repository/rating.repository';
import { NewRating } from '../types/Rating';

export const createRating = async (data: NewRating) => {
  const rating = await ratingRepository.insertRating(data);

  return rating;
};

export const deleteRating = async (id: number) => {
  const rating = await ratingRepository.deleteById(id);

  if (!rating) {
    throw new NotFoundError({ description: `No rating with id: ${id}` });
  }

  return rating;
};

export const ratingService = {
  createRating,
  deleteRating
};
