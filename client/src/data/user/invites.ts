import api from '@/lib/create-fetcher';
import { AxiosError } from 'axios';

export const getUserInvites = async (userId: number) => {
  try {
    const { data } = await api.get(`/users/${userId}/invites`);

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.description);
    }

    throw new Error('Something went wrong');
  }
};
