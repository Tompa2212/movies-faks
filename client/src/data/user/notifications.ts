import api from '@/lib/axios-instance';

export const getUserNotifications = async (userId: number) => {
  try {
    const { data } = await api.get(`/users/${userId}/notifications`);

    return data;
  } catch (error) {
    throw error;
  }
};
