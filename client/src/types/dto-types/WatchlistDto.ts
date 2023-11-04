import { Movie } from '../Movie';
import { User } from '../User';

export interface WathclistListDto {
  id: number;
  title: string;
  owner_id: number;
  isOwner: boolean;
  movies: Pick<Movie, 'id' | 'title' | 'poster' | 'rating' | 'votes'>[];
  users: Pick<User, 'id' | 'firstName' | 'lastName' | 'image' | 'username'>[];
}

export interface WatchlistDto {
  id: number;
  title: string;
  owner_id: number;
  isOwner: boolean;
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
