'use client';
import Link from 'next/link';
import { buttonVariants } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '../ui/DropdownMenu';
import Icon from '../ui/Icons';

import { cn } from '@/lib/utils';
import { useUserNotifications } from '@/hooks/use-user-notifications';

const timeAgoDelta = (dateStr: string) => {
  const date = new Date(dateStr).getTime();

  const timeMin = Math.floor((Date.now() - date) / 1000 / 60);

  if (timeMin < 60) {
    return `${timeMin}m ago`;
  }

  const hrs = Math.floor(timeMin / 60);

  if (hrs >= 24) {
    return new Date(date).toLocaleDateString();
  }

  const remainingMin = timeMin - hrs * 60;

  return `${hrs}h ${remainingMin}m ago`;
};

const UserNotifications = ({ userId }: { userId: number }) => {
  const {
    notifications,
    error,
    isLoading,
    markAllSeen,
    markNotificationRead,
    onSelectAction
  } = useUserNotifications(userId);

  if (error) {
    return <Icon name="Bell" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const notSeenCount = notifications.reduce(
    (_: any, curr: any) => (curr.seen ? 0 : 1),
    0
  );

  return (
    <DropdownMenu
      onOpenChange={() => {
        if (!notSeenCount) {
          return;
        }

        markAllSeen();
      }}
    >
      <DropdownMenuTrigger>
        <div className="relative px-1">
          <Icon name="Bell" />
          {notSeenCount ? (
            <span
              className="absolute  -top-[2px] -right-[1px] inline-flex items-center justify-center h-4 min-w-[16px] text-xs bg-red-600 rounded-[22px] text-zinc-50"
              aria-label="not seen notifications count"
            >
              {notSeenCount}
            </span>
          ) : null}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="xs:min-w-[250px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <h3 className="text-base">Notifications</h3>
          <Link
            href="/notifications"
            className={cn(
              buttonVariants({ variant: 'link', size: 'sm' }),
              'h-auto p-0 text-sm text-blue-500'
            )}
          >
            View all
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications?.length ? (
          <>
            {notifications.map((notification: any) => (
              <DropdownMenuItem
                onSelect={() => {
                  onSelectAction(notification.id);
                }}
                key={notification.id}
                className="text-sm max-w-xs p-0 [&:not(:last-child)]:border-b-2 border-slate-100"
              >
                <div className="w-full p-2">
                  <h5 className="mb-1 font-semibold">
                    {notification.attributes.title}
                  </h5>
                  <p className="mb-1">{notification.attributes.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {timeAgoDelta(notification.creationDateTime)}
                    </p>
                    {notification.status === 'unread' ? (
                      <>
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-700 rounded-[50%]"></span>
                        <span className="sr-only">Unread notification</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <DropdownMenuLabel className="text-sm font-normal text-gray-500">
            No notifications
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNotifications;
