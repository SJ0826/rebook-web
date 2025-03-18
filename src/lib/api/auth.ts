import { privateAxiosClient, publicAxiosClient } from '@/lib/api/axios.client';

// 회원가입
export const signupUserAPI = async (payload: {
  email: string;
  name: string;
  password: string;
}) => {
  const response = await publicAxiosClient.post('/auth/register', payload);
  return response.data;
};

// 로그인
export const loginUserAPI = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await publicAxiosClient.post('/auth/login', payload);
  return response.data;
};

// 토큰 갱신
export const refreshTokenAPI = async () => {
  const response = await publicAxiosClient.post(
    '/auth/refresh',
    {},
    { withCredentials: true }
  );
  return response.data;
};

// 로그아웃
export const logoutUserAPI = async () => {
  const response = await privateAxiosClient.post(
    '/auth/logout',
    {},
    { withCredentials: true }
  );
  return response.data;
};
