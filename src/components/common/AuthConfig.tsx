'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';

interface AuthConfigProps {
  children: React.ReactNode;
}

const AuthConfig = ({ children }: AuthConfigProps) => {
  const pathname = usePathname();
  const { refreshToken, isLoggedIn } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      // 1. 로그인중이 아니거나
      if (!isLoggedIn) return;
      // 2. 로그인, 회원가입 페이지는 실행하지 않음.
      if (pathname === ROUTES.SIGNUP || pathname === ROUTES.LOGIN) return;
      try {
        await refreshToken(); //
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
};

export default AuthConfig;
