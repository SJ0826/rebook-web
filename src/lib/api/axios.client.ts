import axios from 'axios';
import { setupInterceptors } from './axios.config';

export const publicAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(publicAxiosClient);
