import React from 'react';

import Link from 'next/link';
import UserAuthForm from './user/UserAuthForm';
import { getSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';

const SignIn = async () => {
  const session = await getSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="max-w-xs mx-auto text-sm">
          By continuing, you are setting up a Movies-Faks account and agree to
          our User Agreement and Privacy Policy.
        </p>
        <UserAuthForm />
        <p className="px-8 text-sm text-center text-zinc-700">
          New to Movies-Faks?{' '}
          <Link
            href="/sign-up"
            className="text-sm underline hover:text-zinc-800 underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
