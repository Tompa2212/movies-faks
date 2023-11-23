import NotFoundError from '../errors/not-found';
import { ratingRepository } from '../repository/rating.repository';
import { NewRating } from '../types/Rating';

const createRating = async (data: NewRating) => {
  const rating = await ratingRepository.insertRating(data);

  return rating;
};

const deleteRating = async (id: number) => {
  const rating = await ratingRepository.deleteById(id);

  if (!rating) {
    throw new NotFoundError({ description: `No rating with id: ${id}` });
  }

  return rating;
};

const getUserRatings = async (id: number) => {
  const ratings = await ratingRepository.findByUserId(id);

  return ratings;
};

export const ratingService = {
  createRating,
  deleteRating,
  getUserRatings
};
