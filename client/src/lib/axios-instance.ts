import { baseApiUrl } from '@/config/base-url.config';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: baseApiUrl,
  withCredentials: true
});

export default axiosInstance;
