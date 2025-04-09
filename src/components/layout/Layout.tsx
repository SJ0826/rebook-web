'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import { getRefreshTokenInServer } from '@/app/actions/getRefreshToken';
import { useAuth } from '@/hooks/useAuth';
import { noAuthRoutes } from '@/lib/data/noAuthRoutes';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { refreshToken, setIsLoggedIn, isLoggedIn } = useAuth();
  const pathName = usePathname();

  useEffect(() => {
    async function fetchToken() {
      const isLoggedIn = await getRefreshTokenInServer();

      if (!isLoggedIn || noAuthRoutes.includes(pathName)) {
        setIsLoggedIn(false);
        return;
      }

      await refreshToken();
      setIsLoggedIn(true);
    }
    fetchToken();
  }, []);

  if (isLoggedIn === undefined) {
    return null;
  }

  return (
    <div>
      {/* 상단 네비게이션 */}
      <Header />
      {/* 메인 콘텐츠 영역 */}
      <main className="container mx-auto h-screen flex-grow px-4 py-8 pt-18">
        {children}
      </main>
    </div>
  );
};

export default Layout;
