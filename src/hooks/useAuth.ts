import { logoutUserAPI, refreshTokenAPI } from '@/lib/api/auth';
import { create } from 'zustand';
import { triggerToast } from '@/lib/contexts/ToastContext';

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isLoggedIn?: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: undefined,
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
    try {
      const newAccessToken = (await refreshTokenAPI()).accessToken;
      if (newAccessToken) {
        set({ accessToken: newAccessToken, isLoggedIn: true });
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      set({ accessToken: null, isLoggedIn: false });
      triggerToast('세션이 만료되었습니다. 다시 로그인해주세요', 'warning');
    }
  },

  setIsLoggedIn: (loggedIn: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', loggedIn ? 'true' : 'false');
    }
    set({ isLoggedIn: loggedIn });
  },

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },
}));

export const useAuth = () => {
  const {
    accessToken,
    login,
    logout,
    refreshToken,
    isLoggedIn,
    setIsLoggedIn,
    setAccessToken,
  } = useAuthStore();

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
    setIsLoggedIn,
    setAccessToken,
  };
};
