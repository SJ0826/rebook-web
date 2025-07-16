import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/commons';
import { triggerToast } from '@/lib/contexts/ToastContext';
import { useAuthStore } from '@/hooks/useAuth';
import { refreshTokenAPI } from '@/lib/api/auth';

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        const newConfig = { ...config };
        newConfig.headers.Authorization = `Bearer ${token}`;
        return newConfig;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiResponse>) => {
      if (error.response) {
        const originalRequest = error.config;

        const isRefreshRequest =
          originalRequest?.url?.includes('/auth/refresh');
        if (error.response.status === 401) {
          if (isRefreshRequest) {
            triggerToast(
              '세션이 만료되었습니다. 다시 로그인해주세요.',
              'warning'
            );
            return Promise.reject(error);
          }

          try {
            const newTokens = await refreshTokenAPI();
            useAuthStore.getState().setAccessToken(newTokens.accessToken);
            useAuthStore.getState().setIsLoggedIn(true);

            if (originalRequest && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return axiosInstance(originalRequest);
            }
          } catch {
            triggerToast(
              '세션이 만료되었습니다. 다시 로그인해주세요.',
              'warning'
            );
            return Promise.reject(error);
          }
        }

        switch (error.response.status) {
          case 400:
            triggerToast(
              error.response.data?.message ?? '잘못된 요청입니다.',
              'error'
            );
            break;
          case 403:
            triggerToast('접근 권한이 없습니다.', 'warning');
            break;
          case 404:
            triggerToast('요청한 리소스를 찾을 수 없습니다.', 'warning');
            break;
          case 500:
            triggerToast(
              '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
              'error'
            );
            break;
          default:
            triggerToast('알 수 없는 오류가 발생했습니다.', 'error');
        }
      } else if (error.request) {
        const errorMessage =
          error.message === 'Network Error'
            ? '네트워크 연결에 실패했습니다. 인터넷 상태를 확인해주세요.'
            : '서버로부터 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.';

        triggerToast(errorMessage, 'error');
      } else {
        console.error('Request error:', error.message);
        triggerToast('요청을 보내는 중 오류가 발생했습니다.', 'error');
      }

      return Promise.reject(error);
    }
  );
};
