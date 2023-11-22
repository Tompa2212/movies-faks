'use client';
import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../ui/Dialog';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icons';
import clsx from 'clsx';
import { useApi } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import _ from 'lodash';

type RateMovieProps = {
  children: React.ReactNode;
  movieId: number;
  userRating: { id: number; rating: number } | null;
  className?: string;
};

const ratingsArr = _.range(1, 11);

const RateMovieAction = ({
  children,
  movieId,
  userRating,
  className
}: RateMovieProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(
    userRating?.rating || null
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(
    userRating?.rating || null
  );

  const [session] = useSession();
  const router = useRouter();
  const api = useApi();
  const { toast } = useToast();

  const onSuccess = () => {
    router.refresh();
    setDialogOpen(false);
  };

  const onError = (description: string) => {
    toast({
      title: 'Error',
      description
    });
  };

  const rateMovie = async () => {
    try {
      await api.post('/ratings', {
        movieId,
        rating: selectedRating
      });
      onSuccess();
    } catch (error) {
      onError('There was an error creating movie rating. Please try again.');
    }
  };

  const deleteRating = async () => {
    try {
      await api.delete(`/ratings/${userRating?.id}`);
      onSuccess();
    } catch (error) {
      onError('There was an error deleting movie rating. Please try again.');
    }
  };

  const displayedRatingNum = hoveredStar ? hoveredStar : selectedRating ?? '?';

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button
        onClick={() => {
          if (session) {
            setDialogOpen(true);
          } else {
            router.push('/sign-in');
          }
        }}
        variant="ghost"
        className={className}
      >
        {children}
      </Button>
      <DialogContent className="px-2 xs:p-6">
        <DialogHeader>
          <DialogTitle className="text-center">
            RATE TITLE
            <span className="block my-4 text-sm text-gray-400">from</span>
          </DialogTitle>
          <div className="mx-auto">
            <div aria-label="Rating" className="text-center">
              <span className="font-semibold">{displayedRatingNum}</span> / 10
            </div>
            <div
              className="flex gap-1 mb-4 xs:gap-2"
              onMouseLeave={() => {
                setHoveredStar(selectedRating ?? null);
              }}
            >
              {ratingsArr.map((starNum) => (
                <Button
                  size="sm"
                  variant="link"
                  className="p-0"
                  key={starNum}
                  onClick={() => {
                    setSelectedRating(starNum);
                  }}
                  onMouseEnter={() => {
                    setHoveredStar(starNum);
                  }}
                >
                  <Icon
                    name="Star"
                    className={clsx(
                      hoveredStar !== null &&
                        starNum <= hoveredStar &&
                        'fill-blue-500 stroke-blue-500'
                    )}
                  />
                </Button>
              ))}
            </div>
            <Button
              onClick={rateMovie}
              disabled={userRating === selectedRating}
              className="w-full mb-3"
            >
              Rate
            </Button>
            {userRating && (
              <Button onClick={deleteRating} variant="ghost" className="w-full">
                Remove rating
              </Button>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RateMovieAction;
