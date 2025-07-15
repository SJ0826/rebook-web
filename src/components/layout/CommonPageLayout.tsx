import React from 'react';

interface CommonPageLayoutProps {
  children: React.ReactNode;
}

/**
 * 페이지 공통 레이아웃
 * - 최대 너비: 1280px (패딩 포함)
 * - 패딩이 포함된 페이지에서 사용
 */
const CommonPageLayout = ({ children }: CommonPageLayoutProps) => {
  return (
    <div className={'mx-auto flex min-h-screen w-full max-w-5xl'}>
      {children}
    </div>
  );
};

export default CommonPageLayout;
