'use client';
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import Icon from '../ui/Icons';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/use-api';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Movie } from '@/types/Movie';
import { ScrollBar, ScrollArea } from '../ui/ScrollArea';
import Image from 'next/image';
import { fallbackMovieImg } from '@/config/base-url.config';

type Props = {};

const MovieSearch = (props: Props) => {
  const [search, setSearch] = useState('');
  const api = useApi();
  const debouncedValue = useDebouncedValue(search, 300);

  const getMovies = async () => {
    if (search) {
      const { data } = await api.get(`/movies?title=${search}`);
      return data;
    }

    return [];
  };

  const {
    data: movies,
    isLoading,
    isFetched
  } = useQuery<Movie[]>({
    queryKey: ['movies-search', debouncedValue],
    queryFn: async () => await getMovies(),
    initialData: []
  });

  const hasMovies = isFetched && movies.length;

  return (
    <div className="relative flex-grow max-w-md">
      <div
        tabIndex={1}
        className="border-0 px-3 gap-2 grid grid-cols-[1fr_auto] items-center bg-white rounded-2xl border-zinc-200 focus-within:ring-offset-black ring-offset-white focus-within:ring-1 focus-within:ring-zinc-950 focus-within:ring-offset-1"
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="p-0 border-0 h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search titles"
        />
        <Icon name="Search" />
      </div>
      <div className="relative">
        <div className="absolute left-0 z-50 grid w-full bg-white rounded shadow-2xl top-2">
          <ScrollArea className="max-h-60">
            <ul>
              {isLoading ? (
                <li>Loading...</li>
              ) : hasMovies ? (
                movies.map((movie) => {
                  return (
                    <li
                      className="p-2 cursor-pointer hover:bg-zinc-100"
                      key={movie.id}
                    >
                      <figure className="flex items-center gap-2">
                        <Image
                          src={movie.poster || fallbackMovieImg}
                          alt={movie.title}
                          className="object-cover w-11 h-11"
                          width={80}
                          height={40}
                        />
                        <figcaption>{movie.title}</figcaption>
                      </figure>
                    </li>
                  );
                })
              ) : search ? (
                <li className="p-2">No titles found</li>
              ) : null}
            </ul>
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MovieSearch;
