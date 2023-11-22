import { Genre } from '../Genre';
import { Movie } from '../Movie';
import { User } from '../User';

type MovieWithGenres = Movie & { genres: Genre[] };

type WatchlistMovieInfo = { addedBy: number; dateAdded: string };

export interface WathclistListItem {
  id: number;
  title: string;
  ownerId: number;
  movies: (Pick<Movie, 'id' | 'title' | 'poster' | 'rating'> &
    WatchlistMovieInfo)[];
  users: Pick<User, 'id' | 'firstName' | 'lastName' | 'image' | 'username'>[];
}

export interface Watchlist {
  id: number;
  title: string;
  ownerId: number;
  movies: Pick<
    Movie,
    | 'id'
    | 'title'
    | 'plot'
    | 'poster'
    | 'rating'
    | 'votes'
    | 'released'
    | 'runtime'
  >[];
  users: Pick<User, 'id' | 'firstName' | 'lastName' | 'image' | 'username'>[];
}
