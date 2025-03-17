import { logoutUserAPI, refreshTokenAPI } from '@/lib/api/auth';
import { create } from 'zustand';

interface AuthStore {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isLoggedIn: boolean;
}

// 브라우저 환경에서만 localStorage를 읽도록 처리
const initialIsLoggedIn =
  typeof window !== 'undefined' &&
  localStorage.getItem('isLoggedIn') === 'true';

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: initialIsLoggedIn,
  accessToken: null,

  login: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
    }
    set({ accessToken: token, isLoggedIn: true });
  },

  logout: async () => {
    await logoutUserAPI();

    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
    set({ accessToken: null, isLoggedIn: false });
  },

  refreshToken: async () => {
    // 브라우저 환경에서만 상태 업데이트
    if (typeof window !== 'undefined') {
      set({ isLoggedIn: true });
    }
    try {
      const newAccessToken = (await refreshTokenAPI()).data.accessToken;
      if (newAccessToken) {
        set({ accessToken: newAccessToken, isLoggedIn: true });
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      set({ accessToken: null, isLoggedIn: false });
    }
  },
}));

export const useAuth = () => {
  const { accessToken, login, logout, refreshToken, isLoggedIn } =
    useAuthStore();

  return {
    accessToken,
    isLoggedIn,
    login: (token: string) => {
      login(token);
    },
    logout: () => {
      logout();
    },
    refreshToken: async () => {
      await refreshToken();
    },
  };
};
