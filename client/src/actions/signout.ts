'use server';

import api from '@/lib/create-fetcher';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  cookies().delete('sessionid');
  await api.get('/auth/logout');
  redirect('/sign-in');
};
