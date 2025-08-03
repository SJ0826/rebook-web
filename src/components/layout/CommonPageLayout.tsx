import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CommonPageLayoutProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * 페이지 공통 레이아웃
 * - 최대 너비: 1280px (패딩 포함)
 * - 패딩이 포함된 페이지에서 사용
 */
const CommonPageLayout = ({ className, children }: CommonPageLayoutProps) => {
  return (
    <div className={twMerge('mx-auto flex h-full w-full max-w-5xl', className)}>
      {children}
    </div>
  );
};

export default CommonPageLayout;
