'use client';
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/Sheet';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useApi } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { Watchlist } from '@/types/Watchlist';

const CreateWatchlistSheet = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const api = useApi();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const { data: watchlist } = await api.post<Watchlist>(
        '/watchlists',
        data
      );

      toast({
        title: 'Success',
        description: `Created watchlist ${watchlist.title}`,
        variant: 'success'
      });

      router.refresh();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: 'Error',
          description: error.response?.data,
          variant: 'destructive'
        });
      }
    }
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
          <SheetTitle>Create Watchlist</SheetTitle>
          <SheetDescription>
            Create your watchlist here. Click create when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-right ">
              Title
            </Label>
            <Input id="title" name="title" className="col-span-3" required />
          </div>
          <SheetFooter>
            <Button type="submit">Create</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateWatchlistSheet;
