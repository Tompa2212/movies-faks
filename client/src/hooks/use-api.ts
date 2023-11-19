'use client';
import api from '@/lib/axios-instance';
import { ApiError } from '@/types/error';
import { AxiosError, AxiosInstance } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const useApi = () => {
  const router = useRouter();
  const fetcherRef = useRef<AxiosInstance>(api);

  useEffect(() => {
    fetcherRef.current.interceptors.response.use(
      (response) => {
        const data = response.data;

        return { ...response, ...data };
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          return router.push('/sign-in');
        }

        return Promise.reject(error as AxiosError<ApiError>);
      }
    );
  }, [router]);

  return fetcherRef.current;
};
