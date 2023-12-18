'use client';
import React from 'react';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/Tooltip';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/use-api';
import { useWatchlist } from '@/providers/WatchlistProvider';
import { useConfirmDialog } from '@/components/confirm-dialog/ConfirmDialogProvider';

const WatchlistDeleteButton = ({}) => {
  const { toast } = useToast();
  const router = useRouter();
  const api = useApi();
  const showConfirmDialog = useConfirmDialog();

  const { title, id: watchlistId } = useWatchlist();

  const handleDelete = async () => {
    try {
      const confirmed = await showConfirmDialog({
        title: `Are you sure you want to delete watchlist ${title}?`,
        description:
          'Deleting watchlist will delete watchlist for you and all watchlist users. Deleting cannot be undone.'
      });

      if (!confirmed) {
        return;
      }

      await api.delete(`/watchlists/${watchlistId}`);

      toast({
        title: 'Deleted',
        description: `Watchlist ${title} deleted`
      });

      router.refresh();
    } catch (error) {}
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={handleDelete} variant="ghost" size="sm">
          <Icon className="w-5 h-5" name="Trash2" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Delete Watchlist</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WatchlistDeleteButton;
