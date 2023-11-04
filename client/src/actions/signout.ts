'use server';

import api from '@/lib/create-fetcher';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  await api.get('/auth/logout');
  redirect('/sign-in');
};
