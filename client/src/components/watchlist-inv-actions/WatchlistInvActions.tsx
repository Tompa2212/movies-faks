'use client';
import React from 'react';
import { Button, buttonVariants } from '../ui/Button';
import { useApi } from '@/hooks/use-api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ToastAction } from '../ui/Toast';

type WatchlistInvActionsProps = {
  watchlistInvId: number;
};

const WatchlistInvActions = ({ watchlistInvId }: WatchlistInvActionsProps) => {
  const api = useApi();
  const router = useRouter();
  const { toast } = useToast();

  const handleAccept = async () => {
    try {
      await api.post(`/watchlist-invitations/${watchlistInvId}/accept`);
      router.refresh();
      toast({
        title: "You've joined!",
        description: (
          <p>
            You have joined watchlist. You can see the watchlist on watchlists
            page.
          </p>
        ),
        action: (
          <ToastAction
            onClick={() => {
              router.push('/watchlists');
            }}
            altText="go to watchlists"
          >
            Go
          </ToastAction>
        )
      });
    } catch (error) {}
  };

  const handleDecline = async () => {
    try {
      await api.delete(`/watchlist-invitations/${watchlistInvId}/decline`);
      router.refresh();
    } catch (error) {}
  };
  return (
    <div>
      <Button
        onClick={handleDecline}
        className="mr-4"
        variant="ghost"
        size="sm"
      >
        Decline
      </Button>
      <Button onClick={handleAccept} size="sm">
        Accept
      </Button>
    </div>
  );
};

export default WatchlistInvActions;
