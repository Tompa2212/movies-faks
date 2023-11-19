import React from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from './user/LoginForm';
import { getAuthSession } from '@/lib/get-session';

const SignIn = async () => {
  const session = await getAuthSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <LoginForm />
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
