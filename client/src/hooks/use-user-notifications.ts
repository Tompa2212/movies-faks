'use client';
import { useEffect } from 'react';
import { useSocket } from '@/providers/SocketProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserNotifications } from '@/data/user/notifications';
import { useApi } from './use-api';

export const useUserNotifications = (userId: number) => {
  const api = useApi();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery<any>({
    queryKey: ['notifications'],
    queryFn: () => getUserNotifications(userId),
    initialData: []
  });

  const { mutate: markAllSeen } = useMutation({
    mutationFn: () => api.post(`/users/${userId}/notifications/seen`),
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

  const { mutate: markNotificationSeen } = useMutation({
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

  return {
    notifications: data,
    error,
    isLoading,
    markAllSeen,
    markNotificationSeen
  };
};
