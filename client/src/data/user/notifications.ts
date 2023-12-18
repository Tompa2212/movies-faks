import api from '@/lib/axios-instance';

export const getUserNotifications = async () => {
  try {
    const { data } = await api.get(`/notifications`);

    return data;
  } catch (error) {
    throw error;
  }
};
