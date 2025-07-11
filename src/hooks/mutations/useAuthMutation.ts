import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUserAPI, resendVerificationEmailAPI } from '@/lib/api/auth';
import { triggerToast } from '@/lib/contexts/ToastContext';
import { useAuth } from '../useAuth';
import { ApiResponse } from '@/types/commons';
import { getMyProfile, updateMyProfile } from '@/lib/api/my';

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

export const useMyProfileMutation = () => {
  return useMutation({
    mutationFn: (form: { name?: string; imageUrl?: string }) =>
      updateMyProfile(form),
    onSuccess: () => {
      triggerToast('이미지 수정이 완료되었어요', 'success');
    },
    onError: () => {
      triggerToast('이미지를 수정하지 못했어요. 다시 시도해주세요', 'error');
    },
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
