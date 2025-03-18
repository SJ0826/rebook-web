'use client';

import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import { getRefreshTokenInServer } from '@/app/actions/getRefreshToken';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { refreshToken, setIsLoggedIn, isLoggedIn } = useAuth();

  useEffect(() => {
    async function fetchToken() {
      const isLoggedIn = await getRefreshTokenInServer();

      if (!isLoggedIn) {
        setIsLoggedIn(false);
        return;
      }
      await refreshToken();
      setIsLoggedIn(true);
    }
    fetchToken();
  }, []);

  if (isLoggedIn === undefined) {
    return null; // 로그인 상태가 결정될 때까지 아무것도 렌더링하지 않음
  }

  return (
    <div>
      {/* 상단 네비게이션 */}
      <Header />
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-18">
        {children}
      </main>
    </div>
  );
};

export default Layout;
