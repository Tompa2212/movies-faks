import 'server-only';
import { cookies } from 'next/headers';
import axiosInstance from './axios-instance';

axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    config.headers['Cookie'] = cookies().toString();
  }

  return config;
});

axiosInstance.interceptors.response.use(async (response) => {
  const data = response.data;

  return { ...response, ...data };
});

export default axiosInstance;
