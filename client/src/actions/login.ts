'use server';

import api from '@/lib/create-fetcher';
import { AxiosError } from 'axios';
import { parse } from 'cookie';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const login = async (formData: FormData) => {
  const { email, password } = Object.fromEntries(formData.entries());

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid data types.');
  }

  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    const allCookies = response.headers['set-cookie'];

    allCookies?.forEach((cookie) => {
      const parsed = parse(cookie);

      const [name, value] = Object.entries(parsed)[0];

      // Don't set expires -> it's handled on separate backend
      cookies().set({
        name,
        value,
        path: parsed.path,
        httpOnly: true
      });
    });

    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.description);
    }
  }
};

export default login;
