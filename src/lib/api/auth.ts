import { privateAxiosClient, publicAxiosClient } from '@/lib/api/axios.client';

const AUTH = '/auth';
// 회원가입
export const signupUserAPI = async (payload: {
  email: string;
  name: string;
  password: string;
}) => {
  const response = await publicAxiosClient.post(`${AUTH}/register`, payload);
  return response.data;
};

// 로그인
export const loginUserAPI = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await publicAxiosClient.post(`${AUTH}/login`, payload);
  return response.data;
};

// 토큰 갱신
export const refreshTokenAPI = async () => {
  const response = await publicAxiosClient.post(
    `${AUTH}/refresh`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// 로그아웃
export const logoutUserAPI = async () => {
  const response = await privateAxiosClient.post(
    `${AUTH}/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// 내 프로필 조회
export const getMyProfile = async () => {
  const response = await privateAxiosClient.get(`${AUTH}/profile`);

  return response.data.data;
};
