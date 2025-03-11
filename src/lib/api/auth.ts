import { publicAxiosClient } from '@/lib/api/axios.client';

// 회원가입
export const signupUserAPI = async (payload: {
  email: string;
  name: string;
  password: string;
}) => {
  const response = await publicAxiosClient.post('/auth/register', payload);
  return response.data;
};
