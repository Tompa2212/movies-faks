import * as z from 'zod';

export const createRatingSchema = z.object({
  body: z.object({
    movieId: z.number({ required_error: 'Provide movie id.' }).positive(),
    rating: z
      .number({ required_error: 'Provide rating for the movie.' })
      .min(1, 'Minimum movie rating is 1.')
      .max(10, 'Maximum movie rating is 10.')
  })
});
