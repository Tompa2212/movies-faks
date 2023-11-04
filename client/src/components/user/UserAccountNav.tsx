import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/DropdownMenu';
import UserAvatar from './UserAvatar';
import Link from 'next/link';
import { User } from 'next-auth';
import Icon from '../ui/Icons';
import UserNotifications from './UserNotifications';
import SignOutMenuItem from './SignOutMenuItem';

interface UserAccountNavProps {
  user: Pick<User, 'image' | 'email' | 'firstName' | 'lastName' | 'id'>;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const userNavUrl = `/user/${user.id}`;

  return (
    <div className="flex items-center gap-6">
      <Link href="/watchlists" className="inline-flex items-center gap-1">
        <Icon name="BookmarkPlus" className="inline-block" />
        <span className="font-semibold">Watchlist</span>
      </Link>
      <UserNotifications />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar user={user} className="w-8 h-8" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.firstName ? (
                <p className="font-medium">
                  {user.firstName} {user.lastName || ''}
                </p>
              ) : null}
              {user.email ? (
                <p className="w-[200px] truncate text-sm text-zinc-700">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Icon name="Tv" className="w-4 h-4 mr-2" />
            <Link href="/">Feed</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="Activity" className="w-4 h-4 mr-2" />
            <Link href="/activity">Activity</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="BookmarkPlus" className="w-4 h-4 mr-2" />
            <Link href="/watchlists">Watchlists</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="User" className="w-4 h-4 mr-2" />
            <Link href="/ratings">Ratings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="Settings" className="w-4 h-4 mr-2" />
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <SignOutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAccountNav;
