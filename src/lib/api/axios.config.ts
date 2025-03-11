import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/commons';
import { triggerToast } from '@/lib/contexts/ToastContext';

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiResponse>) => {
      if (error.response) {
        // 서버 응답이 있는 경우
        switch (error.response.status) {
          case 400:
            triggerToast(
              error.response.data?.message ?? '잘못된 요청입니다.',
              'error'
            );
            break;
          case 401:
            alert('인증이 필요합니다. 다시 로그인하세요.');
            break;
          case 403:
            alert('접근 권한이 없습니다.');
            break;
          case 404:
            alert('요청한 리소스를 찾을 수 없습니다.');
            break;
          case 500:
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            alert('알 수 없는 오류가 발생했습니다.');
        }
      } else if (error.request) {
        // 요청은 전송되었지만 응답을 받지 못한 경우
        console.error('No response received:', error.request);
        alert('서버로부터 응답을 받지 못했습니다.');
      } else {
        // 요청을 보내기 전에 발생한 오류
        console.error('Request error:', error.message);
        alert('요청을 보내는 중 오류가 발생했습니다.');
      }

      return Promise.reject(error);
    }
  );
};
