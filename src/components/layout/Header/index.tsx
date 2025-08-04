'use client';

import React, { useEffect, useState } from 'react';
import DesktopHeader from '@/components/layout/Header/DesktopHeader';
import MobileHeader from '@/components/layout/Header/MobileHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <>{isDesktop ? <DesktopHeader /> : <MobileHeader />}</>;
};

export default Header;
