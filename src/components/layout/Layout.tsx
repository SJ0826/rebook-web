import React from 'react';
import Header from '@/components/layout/Header';
import { twMerge } from 'tailwind-merge';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={twMerge('flex min-h-screen flex-col')}>
      {/* 상단 네비게이션 */}
      <Header />
      {/* 메인 콘텐츠 영역 */}
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
    </div>
  );
};

export default Layout;
