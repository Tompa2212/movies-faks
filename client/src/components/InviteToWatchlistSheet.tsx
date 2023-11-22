'use client';
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/Sheet';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import { useApi } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import SelectField from './ui/SelectField';
import { SelectValue } from './ui/Select';
import { User } from '@/types/User';
import AsyncSelectField from './ui/AsyncSelect';
import { WathclistListItem } from '@/types/dto-types/WatchlistDto';

const initialFormState = {
  watchlist: '',
  users: []
};

const InviteToWatchlistSheet = ({
  children,
  watchlists
}: {
  children: React.ReactNode;
  watchlists: Omit<WathclistListItem, 'movies'>[];
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    watchlist: string;
    users: { value: string; label: string }[];
  }>(initialFormState);

  const api = useApi();
  const { toast } = useToast();

  const loadOptions = async (search: string) => {
    const { data } = await api.get<User[]>('/users/search/' + search);

    const selectedWatchlist = watchlists.find(
      (w) => w.id === +formData.watchlist
    );

    if (!selectedWatchlist) {
      return [];
    }

    return data.map((user) => ({
      value: user.id.toString(),
      label: user.email,
      isDisabled:
        selectedWatchlist.users.findIndex((u) => u.id === user.id) !== -1
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { watchlist, users } = formData;

    if (!watchlist || users.length === 0) {
      return;
    }

    try {
      await api.post(`/watchlist-invitations`, {
        userIds: users.map((u) => Number(u.value)),
        watchlistId: Number(watchlist)
      });

      setFormData({ ...initialFormState });
      toast({
        title: 'Users Invited',
        description: 'Watchlist invite sent to users.',
        variant: 'success'
      });
    } catch (error) {}
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite users</SheetTitle>
          <SheetDescription>
            Share your watchlist with others. Choose watchlist and search for
            users. Click invite when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="watchlist">Watchlist</Label>
            <SelectField
              options={watchlists.map((w) => ({
                value: w.id.toString(),
                label: w.title
              }))}
              value={formData.watchlist}
              onValueChange={(value) => {
                setFormData((curr) => ({ ...curr, watchlist: value }));
              }}
              trigger={
                <SelectValue placeholder="Select watchlist"></SelectValue>
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="users" className="block mb-2">
              Users
            </Label>
            <AsyncSelectField
              id="users"
              isMulti
              loadOptions={loadOptions}
              placeholder="Search users..."
              closeMenuOnSelect={false}
              defaultOptions={formData.users}
              value={formData.users}
              onChange={(values) => {
                setFormData((curr) => {
                  const users = values.map((value) => value);
                  return { ...curr, users };
                });
              }}
            />
          </div>

          <Button className="justify-self-end" type="submit">
            Invite
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default InviteToWatchlistSheet;
