import { getAuthSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import React from 'react';
import RegisterForm from './user/RegisterForm';
import Link from 'next/link';

const SignUp = async () => {
  const session = await getAuthSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
        <p className="max-w-xs mx-auto text-sm">
          By continuing, you are setting up a Movies-Faks account and agree to
          our User Agreement and Privacy Policy.
        </p>
        <RegisterForm />
        <p className="px-8 text-sm text-center text-zinc-700">
          Already a member?{' '}
          <Link
            href="/sign-in"
            className="text-sm underline hover:text-zinc-800 underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
