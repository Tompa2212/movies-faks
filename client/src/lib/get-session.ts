import { baseApiUrl } from '@/config/base-url.config';
import { SessionUser } from '@/types/User';
import { cookies } from 'next/headers';

export const getSession = async (): Promise<{ user: SessionUser } | null> => {
  const c = cookies().toString();

  const res = await fetch(`${baseApiUrl}/auth/session`, {
    credentials: 'include',
    headers: {
      Cookie: c
    }
  });

  if (!res.ok) {
    return null;
  }

  const { user } = await res.json();

  return { user };
};
