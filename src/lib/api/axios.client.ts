import axios from 'axios';
import { setupInterceptors } from './axios.config';

export const publicAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

setupInterceptors(privateAxiosClient);
