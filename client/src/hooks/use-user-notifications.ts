'use client';
import { useEffect } from 'react';
import { useSocket } from '@/providers/SocketProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserNotifications } from '@/data/user/notifications';
import { useApi } from './use-api';
import { useRouter } from 'next/navigation';

export const useUserNotifications = (userId: number) => {
  const api = useApi();
  const socket = useSocket();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery<any>({
    queryKey: ['notifications', userId],
    queryFn: () => getUserNotifications(),
    initialData: []
  });

  const { mutate: markAllSeen } = useMutation({
    mutationFn: () => api.post(`/notifications/seen`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (oldNotifications: any) => {
        oldNotifications.map((oN: any) => {
          oN.seen = true;

          return oN;
        });
      });

      return { previousNotifications };
    },
    onError: (_err, _newData, context: any) => {
      queryClient.setQueryData(
        ['notifications'],
        context.previousNotifications
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
    }
  });

  const { mutate: markNotificationRead } = useMutation({
    mutationFn: (notificationId: number) =>
      api.patch(`/notifications/${notificationId}`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (oldNotifications: any) => {
        oldNotifications.map((oN: any) => {
          oN.status = 'read';

          return oN;
        });
      });

      return { previousNotifications };
    },
    onError: (_err, _newData, context: any) => {
      queryClient.setQueryData(
        ['notifications'],
        context.previousNotifications
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
    }
  });

  useEffect(() => {
    socket.on('new notification', async () => {
      refetch();
    });

    () => {
      return socket.off('new notification');
    };
  }, [refetch, socket]);

  const onSelectAction = (id: number) => {
    const notification = data.find((n: any) => n.id === id);

    if (!notification) {
      return;
    }

    markNotificationRead(notification.id);

    switch (notification.type) {
      case 'watchlist_invitation': {
        router.push('/invites');
        break;
      }
    }
  };

  return {
    notifications: data,
    error,
    isLoading,
    markAllSeen,
    markNotificationRead,
    onSelectAction
  };
};
