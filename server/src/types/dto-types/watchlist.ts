import { Movie } from '../Movie';
import { User } from '../User';

export interface WathclistListDto {
  id: number;
  title: string;
  ownerId: number;
  movies: Pick<Movie, 'id' | 'title' | 'poster'>[];
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
  > &
    { order: number }[];
  users: Pick<User, 'id' | 'firstName' | 'lastName' | 'image' | 'username'>[];
}
