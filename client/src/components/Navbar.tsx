import { getAuthSession } from '@/lib/get-session';
import Link from 'next/link';
import Icon from './ui/Icons';
import UserAccountNav from './user/UserAccountNav';
import MovieSearch from './movie-search/MovieSearch';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-3">
      <div className="container flex items-center justify-between h-full gap-2 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <Icon name="Tv" className="w-8 h-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Movies-Faks
          </p>
        </Link>
        <MovieSearch />
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className="flex items-center gap-2">
            <Icon className="w-5 h-5" name="LogIn" />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
