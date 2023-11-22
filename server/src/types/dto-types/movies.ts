import { Genre } from '../Genre';
import { Movie } from '../Movie';

export interface MovieListDto
  extends Omit<Movie, 'fullPlot' | 'releasedYear' | 'mongoId' | 'type'> {
  genres: Genre[];
  rank: number;
}

export type MovieDto = Movie & {
  genres: Genre[];
  isBookmarked: boolean;
  rating: {
    id: number;
    rating: number;
  };
};
