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

const grayColorPages = [ROUTES.SIGNUP, ROUTES.LOGIN];

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isGray = grayColorPages.includes(pathname);

  return (
    <main className={twMerge('flex min-h-screen flex-col pt-12 lg:pt-34')}>
      {/* 상단 네비게이션 */}
      <Header />
      {/* 메인 콘텐츠 영역 */}
      <div
        className={twMerge(
          'flex flex-1 flex-col pb-60',
          isGray && 'bg-gray-50'
        )}
      >
        {children}
      </div>
      {/*  푸터 */}
      <Footer />
    </main>
  );
};

export default Layout;
