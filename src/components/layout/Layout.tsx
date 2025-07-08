import React from 'react';
import { twMerge } from 'tailwind-merge';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';
import Header from '@/components/layout/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={twMerge('flex min-h-screen flex-col pt-34')}>
      {/* 상단 네비게이션 */}
      <Header />
      {/* 메인 콘텐츠 영역 */}
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
    </div>
  );
};

export default Layout;
