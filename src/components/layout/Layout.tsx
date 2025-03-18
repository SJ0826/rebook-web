'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface LayoutProps {
  children: React.ReactNode;
}

const Header = dynamic(() => import('@/components/layout/Header'), {
  ssr: false,
  loading: () => (
    <div
      className="navbar bg-base-100 shadow-md fixed top-0 w-full z-50"
      style={{ height: '64px' }}
    ></div>
  ),
});

const Layout = ({ children }: LayoutProps) => {
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
