'use client';
import AsyncSelectField from '@/components/ui/AsyncSelect';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import Icon from '@/components/ui/Icons';
import { Label } from '@/components/ui/Label';
import { useApi } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useWatchlist } from '@/providers/WatchlistProvider';
import { Movie } from '@/types/Movie';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type WatchlistCardMoviesAddMovieProps = {};

const WatchlistCardMoviesAddMovie = ({}: WatchlistCardMoviesAddMovieProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { id } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const api = useApi();
  const router = useRouter();
  const { toast } = useToast();

  const loadOptions = async (search: string) => {
    const { data } = await api.get<Movie[]>('/movies?title=' + search);

    return data.map((movie) => ({
      value: movie.id.toString(),
      label: movie.title
    }));
  };

  const handleAdd = async () => {
    try {
      await api.post(`/watchlists/${id}/movies`, {
        movieId: Number(selectedMovie?.value)
      });
      router.refresh();
      setSelectedMovie(null);
      toast({
        title: 'Movie added',
        description: 'Movie was added to watchlist'
      });
    } catch (error) {}
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="self-center w-auto h-auto m-2 max-h-16"
          >
            <Icon name="Plus" className="w-10 h-10" />
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2 xs:p-6">
          <DialogHeader>
            <DialogTitle className="text-center">
              Add Movie to Watchlist
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label className="block mb-2">Movie</Label>
            <AsyncSelectField
              id="movies"
              cacheOptions={false}
              loadOptions={loadOptions}
              placeholder="Search movies..."
              value={selectedMovie}
              isClearable
              onChange={(value) => {
                setSelectedMovie(value);
              }}
            />
          </div>
          <DialogFooter>
            <div className="ms-auto">
              <Button
                onClick={handleAdd}
                disabled={!selectedMovie || !selectedMovie.value}
              >
                Add
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WatchlistCardMoviesAddMovie;
