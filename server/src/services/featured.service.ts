import { CronJob } from 'cron';
import redisClient from '../utils/redis-client';
import { featuredRepository } from '../repository/featured.repository';

const getFeaturedTitles = async () => {
  const promises = await Promise.all([
    redisClient.get('featured:top250'),
    redisClient.get('featured:top250Tv'),
    redisClient.get('featured:newReleases'),
    redisClient.get('featured:trending')
  ]);

  const [top250, top250Tv, newReleases, trending] = promises.map((res) =>
    JSON.parse(res || '[]')
  );

  return {
    top250,
    top250Tv,
    newReleases,
    trending
  };
};

CronJob.from({
  // cronTime: '0 0 * * *'
  cronTime: '* * * * *',
  onTick: async () => {
    const { top250, newReleases, top250Tv, trending } =
      await featuredRepository.getFeaturedTitles();

    await Promise.all([
      redisClient.set('featured:top250', JSON.stringify(top250)),
      redisClient.set('featured:top250Tv', JSON.stringify(top250Tv)),
      redisClient.set('featured:newReleases', JSON.stringify(newReleases)),
      redisClient.set('featured:trending', JSON.stringify(trending))
    ]);
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});

export const featuredService = {
  getFeaturedTitles
};
