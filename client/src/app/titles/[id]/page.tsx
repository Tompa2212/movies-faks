import { getMovie } from '@/data/movies/get-movie';
import React from 'react';
import Movie from '@/components/movie/Movie';

export const revalidate = 60 * 60 * 24; // 24 hours
export const dynamic = true;

const page = async ({ params }: { params: { id: string } }) => {
  const movie = await getMovie(params.id);

  return (
    <section className="max-w-4xl pb-6 mx-auto">
      <Movie movie={movie} />
    </section>
  );
};

export default page;
