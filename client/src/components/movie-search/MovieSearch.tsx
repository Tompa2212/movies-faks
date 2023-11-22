'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/Input';
import Icon from '../ui/Icons';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/use-api';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Movie } from '@/types/Movie';
import { ScrollBar, ScrollArea } from '../ui/ScrollArea';
import Image from 'next/image';
import { fallbackMovieImg } from '@/config/base-url.config';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { getYearFromDate } from '@/utils/get-year-from-date';

const scrollIntoView = (el: Element) => {
  el.scrollIntoView({ block: 'nearest' });
};

const MovieSearch = () => {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const router = useRouter();

  const ulRef = useRef<HTMLUListElement>(null);

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
    isFetched,
    isFetching
  } = useQuery<Movie[]>({
    queryKey: ['movies-search', debouncedValue],
    queryFn: async () => await getMovies(),
    initialData: []
  });

  useEffect(() => {
    const onArrowNavigation = (e: KeyboardEvent) => {
      const key = e.key;
      if (!['ArrowDown', 'ArrowUp'].includes(key)) {
        return;
      }

      if (showSuggestions) {
        setFocusedItem((curr) => {
          let newFocused = curr;

          if (key === 'ArrowDown') {
            if (newFocused === null) {
              newFocused = 0;
            } else {
              newFocused = Math.min(newFocused + 1, movies.length - 1);
            }
          } else if (key === 'ArrowUp') {
            if (newFocused !== null) {
              newFocused = Math.max(0, newFocused - 1);
            }
          }

          if (ulRef.current) {
            scrollIntoView(ulRef.current?.children[newFocused || 0]);
          }

          return newFocused;
        });
      }
    };

    document.addEventListener('keydown', onArrowNavigation);

    return () => {
      document.removeEventListener('keydown', onArrowNavigation);
    };
  }, [showSuggestions, movies]);

  useEffect(() => {
    const onSelect = (e: KeyboardEvent) => {
      if (focusedItem === null) {
        return;
      }

      if (e.key !== 'Enter') {
        return;
      }

      router.push(`/titles/${movies[focusedItem].id}`);
      setShowSuggestions(false);
    };

    document.addEventListener('keyup', onSelect);

    return () => {
      document.removeEventListener('keyup', onSelect);
    };
  }, [router, movies, focusedItem]);

  const hasMovies = isFetched && movies.length;

  return (
    <div className="relative flex-grow max-w-md">
      <div
        tabIndex={1}
        className="border-0 px-3 gap-2 grid grid-cols-[1fr_auto] items-center bg-white rounded-xl border-zinc-200 focus-within:ring-offset-black ring-offset-white focus-within:ring-1 focus-within:ring-zinc-950 focus-within:ring-offset-1"
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            setShowSuggestions(false);
            setFocusedItem(null);
          }}
          type="text"
          className="p-0 border-0 h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search titles"
        />
        <Icon name="Search" />
      </div>
      <div className="relative">
        {showSuggestions && (
          <div className="absolute left-0 z-50 grid w-full bg-white rounded shadow-2xl top-2">
            <ScrollArea className="max-h-60">
              <ul ref={ulRef}>
                {isFetching ? (
                  <li>Loading...</li>
                ) : hasMovies ? (
                  movies.map((movie, idx) => {
                    return (
                      <li
                        className={clsx(
                          'p-2 cursor-pointer hover:bg-zinc-100 focus-visible:bg-red-300',
                          focusedItem === idx && 'bg-zinc-100'
                        )}
                        onMouseDown={() => {
                          router.push(`/titles/${movie.id}`);
                        }}
                        key={movie.id}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={movie.poster || fallbackMovieImg}
                            alt={movie.title}
                            className="object-cover w-11 h-11"
                            width={80}
                            height={40}
                          />
                          <div>
                            <p>{movie.title}</p>
                            {movie.released && (
                              <small className="text-gray-400">
                                {getYearFromDate(new Date(movie.released))}
                              </small>
                            )}
                          </div>
                        </div>
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
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
