'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { twMerge } from 'tailwind-merge';

const grayColorPages = [ROUTES.SIGNUP, ROUTES.LOGIN];

const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isGray = grayColorPages.includes(pathname);

  return (
    <main className={twMerge('flex flex-1 flex-col', isGray && 'bg-gray-50')}>
      {children}
    </main>
  );
};

export default ClientLayoutWrapper;
