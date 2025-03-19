import { logoutUserAPI, refreshTokenAPI } from '@/lib/api/auth';
import { create } from 'zustand';

interface AuthStore {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isLoggedIn?: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

// const initialIsLoggedIn =
//   typeof window !== 'undefined' &&
//   localStorage.getItem('isLoggedIn') === 'true';

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
      const newAccessToken = (await refreshTokenAPI()).data.accessToken;
      if (newAccessToken) {
        set({ accessToken: newAccessToken, isLoggedIn: true });
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      set({ accessToken: null, isLoggedIn: false });
    }
  },

  setIsLoggedIn: (loggedIn: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', loggedIn ? 'true' : 'false');
    }
    set({ isLoggedIn: loggedIn });
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
  };
};
