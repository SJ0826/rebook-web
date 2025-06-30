'use client';

import React from 'react';
import Header from '@/components/layout/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 네비게이션 */}
      <Header />
      {/* 메인 콘텐츠 영역 */}
      <main className="container mx-auto flex flex-1 flex-col py-18">
        {children}
      </main>
    </div>
  );
};

export default Layout;
