import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icons';
import { fallbackMovieImg } from '@/config/base-url.config';
import { getMovie } from '@/data/movies/get-movie';
import { getYearFromDate } from '@/utils/get-year-from-date';
import Image from 'next/image';
import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { createDurationLabel } from '@/utils/create-duration-label';
import clsx from 'clsx';
import { createVotesLabel } from '@/utils/create-votes-label';
import BookmarkedToggle from '@/components/bookmarked-toggle/BookmarkedToggle';
import Movie from '@/components/movie/Movie';

const page = async ({ params }: { params: { id: string } }) => {
  const movie = await getMovie(params.id);

  return (
    <section className="max-w-4xl pb-6 mx-auto">
      <Movie movie={movie} />
    </section>
  );
};

export default page;
