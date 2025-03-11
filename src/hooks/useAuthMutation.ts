import { useMutation } from '@tanstack/react-query';
import { signupUserAPI } from '@/lib/api/auth';
import { triggerToast } from '@/lib/contexts/ToastContext';

// 회원가입
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: signupUserAPI,
    onSuccess: () => triggerToast('회원가입에 성공했습니다.', 'success'),
  });
};
