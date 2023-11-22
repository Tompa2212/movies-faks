import MovieSlide from '@/components/MovieSlide';
import Icon from '@/components/ui/Icons';
import { getFeaturedTitles } from '@/data/featured/get-featured-titles';
import { getAuthSession } from '@/lib/get-session';
import Link from 'next/link';

const data = [
  {
    id: 6905,
    title: 'The Shawshank Redemption',
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_SX677_AL_.jpg'
  },
  {
    id: 3042,
    title: 'The Godfather: Part II',
    plot: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg',
    released: '1974-12-20 00:00:00+00',
    runtime: 200,
    rating: '9.1',
    votes: 226,
    genres: [
      {
        id: 6,
        name: 'Crime'
      },
      {
        id: 8,
        name: 'Drama'
      }
    ],
    rank: '2'
  },
  {
    id: 4137,
    title: 'The Marathon Family',
    plot: 'The Topalovic family has been in the burial business for generations. When the old (150 yrs old) Pantelija dies, five generations of his heirs start to fight for the inheritance.',
    poster: null,
    released: '1982-03-04 00:00:00+00',
    runtime: 92,
    rating: '9.0',
    votes: 244,
    genres: [
      {
        id: 5,
        name: 'Comedy'
      },
      {
        id: 8,
        name: 'Drama'
      }
    ],
    rank: '3'
  },
  {
    id: 14312,
    title: 'The Dark Knight',
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SY1000_SX677_AL_.jpg',
    released: '2008-07-18 00:00:00+00',
    runtime: 152,
    rating: '9.0',
    votes: 241,
    genres: [
      {
        id: 1,
        name: 'Action'
      },
      {
        id: 6,
        name: 'Crime'
      },
      {
        id: 8,
        name: 'Drama'
      }
    ],
    rank: '4'
  },
  {
    id: 10578,
    title: 'The Chaos Class Failed the Class',
    plot: 'A young and beautiful female teacher starts working in an all boys high school.',
    poster: null,
    released: '1976-01-01 00:00:00+00',
    runtime: 91,
    rating: '9.0',
    votes: 216,
    genres: [
      {
        id: 5,
        name: 'Comedy'
      }
    ],
    rank: '5'
  },
  {
    id: 6975,
    title: 'Pulp Fiction',
    plot: "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster:
      'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg',
    released: '1994-10-14 00:00:00+00',
    runtime: 154,
    rating: '8.9',
    votes: 246,
    genres: [
      {
        id: 6,
        name: 'Crime'
      },
      {
        id: 8,
        name: 'Drama'
      }
    ],
    rank: '6'
  },
  {
    id: 12580,
    title: 'Love is God',
    plot: 'Nalla Sivam and Anbarasu meet under different circumstances and their lives are changed as they take the journey of their life.',
    poster: null,
    released: '2003-01-14 00:00:00+00',
    runtime: 160,
    rating: '8.9',
    votes: 219,
    genres: [
      {
        id: 2,
        name: 'Adventure'
      },
      {
        id: 5,
        name: 'Comedy'
      },
      {
        id: 8,
        name: 'Drama'
      }
    ],
    rank: '7'
  },
  {
    id: 4509,
    title: 'Balkan Spy',
    plot: 'Ilija Cvorovic, a reformed former Stalinist who spent several years in a prison as a political prisoner, is called in for a routine conversation. He returns home convinced that the police ...',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMmY1NDQ4MmYtZjYyMC00ZTFhLWIxZGUtZTE0YmI3YWNlNTRlXkEyXkFqcGdeQXVyMTk0MjQ3Nzk@._V1_SY1000_SX677_AL_.jpg',
    released: '1987-10-08 00:00:00+00',
    runtime: 95,
    rating: '8.9',
    votes: 216,
    genres: [
      {
        id: 5,
        name: 'Comedy'
      },
      {
        id: 8,
        name: 'Drama'
      }
    ],
    rank: '8'
  },
  {
    id: 9164,
    title: 'The Lord of the Rings: The Return of the King',
    plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    poster:
      'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg',
    released: '2003-12-17 00:00:00+00',
    runtime: 201,
    rating: '8.9',
    votes: 206,
    genres: [
      {
        id: 2,
        name: 'Adventure'
      },
      {
        id: 10,
        name: 'Fantasy'
      }
    ],
    rank: '9'
  },
  {
    id: 6793,
    title: 'Forrest Gump',
    plot: 'Forrest Gump, while not intelligent, has accidentally been present at many historic moments, but his true love, Jenny Curran, eludes him.',
    poster:
      'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SY1000_SX677_AL_.jpg',
    released: '1994-07-06 00:00:00+00',
    runtime: 142,
    rating: '8.8',
    votes: 245,
    genres: [
      {
        id: 8,
        name: 'Drama'
      },
      {
        id: 18,
        name: 'Romance'
      }
    ],
    rank: '10'
  }
];

export default async function Home() {
  const { top250, top250Tv, newReleases, trending } = await getFeaturedTitles();
  const session = await getAuthSession();

  return (
    <main className="flex flex-col min-h-screen gap-10">
      <section>
        <div className="max-w-full pr-2">
          <h3 className="flex items-center gap-3 mb-2 text-lg font-semibold">
            Trending
            <Icon name="TrendingUp" className="text-green-600" />
          </h3>
          <MovieSlide movies={trending} />
        </div>
      </section>
      {session && (
        <section>
          <h3 className="mb-2 text-lg font-semibold">Recommended For You</h3>
          <MovieSlide movies={data} />
        </section>
      )}
      <section>
        <h3 className="flex items-center gap-3 mb-2 text-lg font-semibold">
          New Releases
          <Icon name="Sparkles" className="text-purple-500" />
        </h3>
        <MovieSlide movies={newReleases} />
      </section>
      <section>
        <h3 className="mb-2 text-lg font-semibold">
          <span className="mr-3">Top Movies</span>
          <Link
            className="text-xs text-blue-500 hover:underline underline-offset-2"
            href="titles/top"
          >
            View all
          </Link>
        </h3>
        <MovieSlide movies={top250} />
      </section>
      <section>
        <h3 className="mb-2 text-lg font-semibold">
          <span className="mr-3">Top TV Shows</span>
          <Link
            className="text-xs text-blue-500 hover:underline underline-offset-2"
            href="titles/toptv"
          >
            View all
          </Link>
        </h3>
        <MovieSlide movies={top250Tv} />
      </section>
    </main>
  );
}
