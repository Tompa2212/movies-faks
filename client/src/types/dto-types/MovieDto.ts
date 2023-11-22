import { Genre } from '../Genre';
import { Movie } from '../Movie';

export type MovieDto = Movie & {
  genres: Genre[];
  isBookmarked: boolean;
  userRating: {
    id: number;
    rating: number;
  };
};
