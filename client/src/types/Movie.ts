export type Movie = {
  type: 'movie' | 'series';
  id: number;
  title: string;
  plot: string | null;
  fullPlot: string | null;
  poster: string | null;
  runtime: number;
  released: Date | null;
  releasedYear: number | null;
  rating: string | null;
  votes: number | null;
  mongoId: string | null;
};

export type MovieListDTO = Omit<Movie, 'mongoId' | 'type' | 'releasedYear'> & {
  genres: Genre[];
  rating: number | null;
  votes: number | null;
  rank: number;
  released: string | null;
};
