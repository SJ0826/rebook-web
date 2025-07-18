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

// 이메일 인증
export const verifyEmailAPI = async (
  token: string
): Promise<{ accessToken: string }> => {
  const response = await privateAxiosClient.get(
    `${AUTH}/email/verify?token=${token}`
  );
  return response.data.data;
};

// 이메일 인증 메일 재전송
export const resendVerificationEmailAPI = async (body: { email: string }) => {
  const response = await publicAxiosClient.post(`${AUTH}/email/resend`, body);
  return response.data.data;
};

// 로그인
export const loginUserAPI = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await publicAxiosClient.post(`${AUTH}/login`, payload, {
    withCredentials: true,
  });
  return response.data;
};

// 토큰 갱신
export const refreshTokenAPI = async () => {
  const response = await privateAxiosClient.post(
    `${AUTH}/refresh`,
    {},
    { withCredentials: true }
  );
  return response.data.data;
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

// 비밀번호 변경
export const changePasswordAPI = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await privateAxiosClient.patch(`${AUTH}/change-password`, {
    currentPassword,
    newPassword,
  });

  return response.data.data;
};
