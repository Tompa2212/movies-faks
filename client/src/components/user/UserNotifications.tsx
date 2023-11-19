import Link from 'next/link';
import { Button, buttonVariants } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '../ui/DropdownMenu';
import Icon from '../ui/Icons';

import { findNotificationyByUserId } from '@/data/user/notifications';
import { cn } from '@/lib/utils';

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

const UserNotifications = async () => {
  const { notifications, unreadCount } = (await findNotificationyByUserId(
    5874
  )) as any;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icon name="Bell" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[250px]">
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
            <DropdownMenuLabel>
              <p>Notifications</p>
              <Button variant="link">View All</Button>
            </DropdownMenuLabel>
            {notifications.map((notification: any) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0 border-b-2 border-slate-100"
              >
                <div className="w-full p-2">
                  <h5 className="mb-1 text-base font-semibold">
                    {notification.title}
                  </h5>
                  <p className="mb-1">{notification.content}</p>
                  <div className="flex items-center justify-between">
                    <p>{timeAgoDelta(notification.createdAt)}</p>
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
