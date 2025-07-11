'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImage from '@public/images/logo.png';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '@/lib/constants';

const MobileHeader = () => {
  return (
    <header
      className={
        'fixed top-0 flex w-full flex-1 justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden'
      }
    >
      {/* 로고 */}
      <Link href="/" className="flex-shrink-0">
        <Image src={logoImage} width={60} alt="Logo" />
      </Link>

      <Link href={ROUTES.SEARCH}>
        <MagnifyingGlassIcon width={16} height={16} />
      </Link>
    </header>
  );
};

export default MobileHeader;
