import { useMutation } from '@tanstack/react-query';
import { loginUserAPI, signupUserAPI } from '@/lib/api/auth';
import { triggerToast } from '@/lib/contexts/ToastContext';
import { useAuth } from './useAuth';
import { ApiResponse } from '@/types/commons';

// 회원가입
export const useRegisterMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: signupUserAPI,
    onSuccess: async (
      data: ApiResponse<{
        accessToken: string;
      }>
    ) => {
      login(data.data.accessToken);
      triggerToast('회원가입에 성공했습니다.', 'success');
    },
  });
};

// 로그인
export const useLoginMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUserAPI,
    onSuccess: async (
      data: ApiResponse<{
        accessToken: string;
      }>
    ) => {
      login(data.data.accessToken);
    },
  });
};
