type MovieType = 'movie' | 'series';

export default class Movie {
  id: number;
  title: string;
  plot: string | null;
  fullPlot: string;
  type: MovieType;
  poster: string | null;
  released: Date | null;
  releasedYear: number | null;
  runtime: number;
  mongoId: string | null;

  constructor({
    id,
    title,
    plot,
    fullPlot,
    type,
    poster,
    released,
    releasedYear,
    runtime,
    mongoId
  }: {
    id: number;
    title: string;
    plot: string | null;
    fullPlot: string;
    type: MovieType;
    poster: string | null;
    released: Date | null;
    releasedYear: number | null;
    runtime: number;
    mongoId: string | null;
  }) {
    this.id = id;
    this.title = title;
    this.plot = plot;
    this.fullPlot = fullPlot;
    this.type = type;
    this.poster = poster;
    this.released = released;
    this.releasedYear = releasedYear;
    this.runtime = runtime;
    this.mongoId = mongoId;
  }
}
