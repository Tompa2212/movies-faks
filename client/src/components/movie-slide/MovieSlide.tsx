'use client';
import { Movie } from '@/types/Movie';
import React from 'react';
import Image from 'next/image';
import { fallbackMovieImg } from '@/config/base-url.config';
import Link from 'next/link';
import MovieSlideWrapper from './MovieSlideWrapper';

const MovieSlide = ({
  movies
}: {
  movies: Pick<Movie, 'id' | 'title' | 'poster'>[];
}) => {
  return (
    <MovieSlideWrapper>
      <div className="flex gap-1 ">
        {movies.length ? (
          movies.map((movie) => (
            <Link
              href={`/titles/${movie.id}`}
              className="flex-shrink-0 overflow-hidden rounded-sm"
              key={movie.id}
            >
              <Image
                className="object-cover w-64 h-64"
                src={movie.poster || fallbackMovieImg}
                alt={movie.title}
                width={300}
                height={300}
              />
            </Link>
          ))
        ) : (
          <p>No movies</p>
        )}
      </div>
    </MovieSlideWrapper>
  );
};

export default MovieSlide;
