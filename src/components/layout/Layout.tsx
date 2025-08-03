'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import { ROUTES } from '@/lib/constants';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const grayColorPages = [ROUTES.SIGNUP, ROUTES.LOGIN, ROUTES.ACCOUNT];

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isGray = grayColorPages.includes(pathname);
  const isChat = pathname.includes(ROUTES.CHAT);

  return (
    <main className={twMerge('flex h-screen flex-col pt-11 lg:pt-33')}>
      {/* 상단 네비게이션 */}
      <Header />

      {/* 스크롤 영역 */}
      <div className={twMerge('flex flex-1 flex-col overflow-y-auto')}>
        {/* 메인 콘텐츠 영역 */}
        <div
          className={twMerge(
            'flex flex-1 flex-col pb-60',
            isGray && 'bg-gray-50',
            isChat && 'pb-0'
          )}
        >
          {children}
        </div>
        {/*  푸터 */}
        <Footer />
      </div>
    </main>
  );
};

export default Layout;
