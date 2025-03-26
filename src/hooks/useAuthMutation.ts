import { useMutation, useQuery } from '@tanstack/react-query';
import {
  loginUserAPI,
  resendVerificationEmailAPI,
  signupUserAPI,
} from '@/lib/api/auth';
import { triggerToast } from '@/lib/contexts/ToastContext';
import { useAuth } from './useAuth';
import { ApiResponse } from '@/types/commons';
import { getMyProfile } from '@/lib/api/my';

// 회원가입
export const useRegisterMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: signupUserAPI,
    //   onSuccess: async (
    //     data: ApiResponse<{
    //       accessToken: string;
    //     }>
    //   ) => {
    //     login(data.data.accessToken);
    //     triggerToast('회원가입에 성공했습니다.', 'success');
    //   },
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

export const useMyProfileQuery = () => {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      return await getMyProfile();
    },
    enabled: isLoggedIn,
  });
};

export const useResendVerificationEmailMutation = () => {
  return useMutation({
    mutationFn: (email: string) => resendVerificationEmailAPI({ email }),
    onSuccess: () => {
      triggerToast('입력하신 이메일로 인증 메일을 다시 보냈어요.', 'success');
    },
    onError: (error) => {
      triggerToast(error.message, 'error');
    },
  });
};
