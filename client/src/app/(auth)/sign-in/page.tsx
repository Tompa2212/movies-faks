import SignIn from '@/components/SignIn';
import Icon from '@/components/ui/Icons';
import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div className="absolute inset-0">
      <div className="flex flex-col items-center justify-center h-full max-w-2xl gap-20 mx-auto md:px-20">
        <Link
          href="/"
          className="flex flex-col items-center gap-3 text-4xl font-semibold"
        >
          <Icon name="Tv" className="w-10 h-10" />
          Movies-Faks
        </Link>
        <SignIn />
      </div>
    </div>
  );
};

export default page;
