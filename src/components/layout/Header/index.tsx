'use client';

import React, { useEffect, useState } from 'react';
import DesktopHeader from '@/components/layout/Header/DesktopHeader';
import MobileHeader from '@/components/layout/Header/MobileHeader';

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* 데스크톱 헤더*/}
      <DesktopHeader />

      {/* 모바일 헤더 */}
      <MobileHeader />
    </>
  );
};

export default Header;
