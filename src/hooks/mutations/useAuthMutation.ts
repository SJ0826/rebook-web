import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUserAPI } from '@/lib/api/auth';
import { useAuth } from '../useAuth';
import { ApiResponse } from '@/types/commons';
import { getMyProfile } from '@/lib/api/my';

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

// export const useResendVerificationEmailMutation = () => {
//   return useMutation({
//     mutationFn: (email: string) => resendVerificationEmailAPI({ email }),
//     onSuccess: () => {
//       triggerToast('입력하신 이메일로 인증 메일을 다시 보냈어요.', 'success');
//     },
//     onError: (error) => {
//       triggerToast(error.message, 'error');
//     },
//   });
// };
