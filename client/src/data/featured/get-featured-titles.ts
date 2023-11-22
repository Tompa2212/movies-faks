import api from '@/lib/create-fetcher';

export const getFeaturedTitles = async () => {
  try {
    const { data } = (await api.get('/featured')) as any;

    return { ...data };
  } catch (error) {
    return {
      top250: [],
      top250Tv: [],
      newReleases: []
    };
  }
};
