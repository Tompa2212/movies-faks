'use client';
import React, { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetDescription,
  SheetTitle
} from '../ui/Sheet';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { useApi } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import { SelectValue } from '../ui/Select';
import SelectField from '../ui/SelectField';
import { AxiosError } from 'axios';
import { useSession } from '@/providers/SessionProvider';

type Props = {
  children: React.ReactNode;
  movieId: number;
  watchlists: WathclistListItem[];
  isBookmarked: boolean;
};

const texts = {
  add: {
    title: 'Add movie to watchlist',
    description: "Add movie to watchlist. Click Add when you're done."
  },
  delete: {
    title: 'Remove movie from watchlist',
    description: "Remove movie from watchlist. Click Remove when you're done."
  }
};

const BookmarkedToggleAction = ({
  children,
  movieId,
  watchlists,
  isBookmarked
}: Props) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const api = useApi();
  const router = useRouter();
  const [session] = useSession();

  const actionType = isBookmarked ? 'delete' : 'add';

  let selectableWatchlists: WathclistListItem[] = watchlists.filter(
    (watchlist) =>
      watchlist.movies.findIndex((movie) => movie.id === movieId) === -1
  );

  if (actionType === 'delete') {
    selectableWatchlists = watchlists.filter(
      (watchlist) =>
        watchlist.movies.findIndex((movie) => movie.id === movieId) !== -1
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { watchlist } = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      if (actionType === 'add') {
        await api.post(`/watchlists/${watchlist}/movies`, {
          movieId: movieId
        });
      } else if (actionType === 'delete') {
        await api.delete(`/watchlists/${watchlist}/movies/${movieId}`);
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.description) {
          toast({
            title: 'Error',
            description: error.response.data.description,
            variant: 'destructive'
          });
        }
      }
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (session) {
          setOpen(open);
        } else {
          router.push('/sign-in');
        }
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{texts[actionType].title}</SheetTitle>
          <SheetDescription>{texts[actionType].description}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="watchlist" className="text-right ">
              Watchlist
            </Label>
            <SelectField
              options={selectableWatchlists.map((w) => ({
                value: w.id.toString(),
                label: w.title
              }))}
              name="watchlist"
              trigger={
                <SelectValue placeholder="Select watchlist"></SelectValue>
              }
            />
          </div>
          <SheetFooter>
            <Button type="submit">
              {actionType === 'delete' ? 'Remove' : 'Add'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default BookmarkedToggleAction;
