import { logoutUserAPI } from '@/lib/api/auth';
import { create } from 'zustand';

interface AuthStore {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  login: (token: string) => set({ accessToken: token }),
  logout: () => set({ accessToken: null }),
}));

export const useAuth = () => {
  const { accessToken, login, logout } = useAuthStore();

  return {
    accessToken,
    isAuthenticated: !!accessToken,
    login: (token: string) => {
      login(token);
    },
    logout: () => {
      logoutUserAPI();
      logout();
    },
  };
};
