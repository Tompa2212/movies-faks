import Icon from '@/components/ui/Icons';
import { getTop250Movies } from '@/data/movies/top-250';
import { createDurationLabel } from '@/utils/create-duration-label';
import { createVotesLabel } from '@/utils/create-votes-label';
import Image from 'next/image';
import Link from 'next/link';

export default async function Top250() {
  const movies = await getTop250Movies();

  return (
    <main className="flex flex-col justify-between min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl">Top 250 Movies</h1>
      </header>
      <section
        className="grid gap-7"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}
      >
        {movies.map((movie) => {
          return (
            <div
              key={movie.id}
              className="flex flex-col overflow-hidden border rounded-lg border-slate-300"
            >
              <div className="h-[300px]">
                <Image
                  className="w-full h-[300px] object-cover"
                  src={
                    movie.poster ||
                    'https://critics.io/img/movies/poster-placeholder.png'
                  }
                  alt={movie.title}
                  width={200}
                  height={170}
                />
              </div>

              <div className="grid flex-1 gap-2 px-4 py-4">
                <div className="flex items-center gap-2">
                  <Icon
                    size={16}
                    name="Star"
                    className="fill-yellow-400 stroke-yellow-400"
                  />
                  <span>
                    {movie.rating}{' '}
                    <span className="text-gray-400">
                      ({createVotesLabel(movie.votes)})
                    </span>
                  </span>
                </div>
                <h3 className="text-lg font-semibold">
                  <Link
                    className="hover:underline underline-offset-4"
                    href={`/titles/${movie.id}`}
                  >
                    {movie.rank}. {movie.title}
                  </Link>
                </h3>
                <p>{movie.plot?.slice(0, 70).trim() + '...'}</p>
                <div>
                  <span className="text-gray-400">
                    {movie.released && new Date(movie.released).getFullYear()}{' '}
                    {createDurationLabel(movie.runtime)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
