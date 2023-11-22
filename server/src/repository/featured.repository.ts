import { pool } from '../db';

const newReleasesSql = `
select 
    id,
    title,
    poster,
    rating,
    released
    from movies m
    where votes > 20 and
    poster is not null
    order by m.released desc nulls last
    limit 10;
`;

const top250Sql = `
    select 
      id,
      title,
      poster,
      rating,
      released
    from movies m
    where votes > 150 and 
    "type" = 'movie' and
    poster is not null
    order by rating desc nulls last, votes desc nulls last
    limit 10;
`;

const top250TvSql = `
    select 
      id,
      title,
      poster,
      rating,
      released
    from movies m
    where votes > 150 and 
    "type" = 'series' and 
    poster is not null
    order by rating desc nulls last, votes desc nulls last
    limit 10;
`;

const trendingSql = `
with ratings_last_10_days as (
  select
    distinct cast ("timestamp" as DATE) as "date"
  from
    ratings
  order by
    1 desc nulls last
  limit 10),
  top_10_trending as (
  select
    movie_id,
    ROUND(avg(r.rating),
    1),
    count(*)
  from
    ratings r
  where
    cast(r."timestamp" as DATE) 
    between 
      (
    select
      min("date")
    from
      ratings_last_10_days) and (
    select
      max("date")
    from
      ratings_last_10_days)
  group by
    movie_id
  having
    avg(r.rating) > 6
  order by
    3 desc,
    2 desc
  limit 10
  )
  select
    m.id,
    m.poster,
    m.title,
    m.rating,
    m.votes
  from
    movies m
  where
    m.poster is not null
    and
  m.id in (
    select
      movie_id
    from
      top_10_trending);
`;

const getFeaturedTitles = async () => {
  const promises = await Promise.all([
    pool.query(newReleasesSql),
    pool.query(top250Sql),
    pool.query(top250TvSql),
    pool.query(trendingSql)
  ]);

  const [newReleases, top250, top250Tv, trending] = promises.map(
    (promise) => promise.rows
  );

  return {
    newReleases,
    top250,
    top250Tv,
    trending
  };
};

export const featuredRepository = {
  getFeaturedTitles
};
