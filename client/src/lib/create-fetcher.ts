import axios from 'axios';
import { baseApiUrl } from '../config/base-url.config';
import { cookies } from 'next/headers';

const api = axios.create({
  baseURL: baseApiUrl
});

api.interceptors.request.use(config => {
  if (typeof window === 'undefined') {
    config.headers['Cookie'] = cookies().toString();
  } else {
    config.withCredentials = true;
  }

  return config;
});

export default api;
