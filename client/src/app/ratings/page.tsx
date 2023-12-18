import { getUserRatings } from '@/data/user/ratings';
import React from 'react';
import Image from 'next/image';
import { fallbackMovieImg } from '@/config/base-url.config';
import { createDurationLabel } from '@/utils/create-duration-label';
import Icon from '@/components/ui/Icons';

type Props = {};

export const dynamic = 'force-dynamic';

const page = async (props: Props) => {
  const ratings = await getUserRatings();

  return (
    <section className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Your Ratings</h1>
      </header>
      <div className="max-w-2xl mx-auto">
        {ratings.map((rating: any, idx: number) => {
          return (
            <div key={rating.id} className="flex gap-4 mb-8">
              <div className="flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={rating.poster || fallbackMovieImg}
                  alt={rating.title}
                  width={150}
                  height={100}
                />
              </div>
              <div>
                <div className="flex flex-col gap-2 mb-2">
                  <h3 className="text-lg">
                    <span className="text-gray-400">{idx + 1}.</span>{' '}
                    {rating.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {createDurationLabel(rating.runtime)}
                    {' | '}
                    <span>
                      {rating.genres.map((g: any) => g.name).join(', ')}
                    </span>
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{rating.userRating}</span>{' '}
                      <Icon
                        className="w-5 h-5 stroke-blue-400 fill-blue-400"
                        name="Star"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Rated on{' '}
                      <span>
                        {new Date(rating.timestamp).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <p>{rating.plot} </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default page;
