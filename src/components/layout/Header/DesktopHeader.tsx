'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpenIcon,
  BuildingStorefrontIcon,
  ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/outline';
import { Input } from '@/components/ui';
import HeaderButton from '@/components/home/HeaderButton';
import { ROUTES } from '@/lib/constants';
import logoImage from '@public/images/logo.png';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setRecentSearch } from '@/lib/utils/recentSearch';

export default function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tempKeyword, setTempKeyword] = useState('');

  // 엔터 키 핸들러
  const onSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedKeyword = tempKeyword.trim();

      if (!trimmedKeyword) return; // 빈 검색어 방지

      // 최근 검색어에 추가
      setRecentSearch(trimmedKeyword);

      if (pathname !== ROUTES.HOME) {
        router.push(
          ROUTES.HOME + `?search=${encodeURIComponent(trimmedKeyword)}`
        );
      } else {
        const params = new URLSearchParams(searchParams.toString());
        params.set('search', trimmedKeyword);

        router.push(`${pathname}?${params.toString()}`);
      }
    }
  };

  // 클리어 핸들러
  const onClearQuery = () => {
    setTempKeyword('');
  };

  return (
    <>
      {/* 데스크톱 헤더*/}
      <header className="fixed top-0 z-50 hidden w-full border-b border-gray-200 bg-white px-10 py-7 lg:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          {/* 로고 */}
          <Link className="btn btn-ghost text-xl" href={ROUTES.HOME} prefetch>
            <Image
              width={90}
              src={logoImage}
              alt={'Rebook logo'}
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          <Input
            placeholder="🔍 원하시는 책 이름을 검색해보세요 !"
            value={tempKeyword}
            onChange={(e) => setTempKeyword(e.target.value)}
            onKeyDown={onSearchKeyPress}
            onClear={onClearQuery}
            className={'border-secondary-500 w-[460px] shadow-none'}
          />
          <nav className="flex items-center gap-4">
            <HeaderButton
              title={'판매하기'}
              path={ROUTES.BOOK}
              icon={<BuildingStorefrontIcon />}
            />
            <HeaderButton
              title={'내 서점'}
              path={ROUTES.BOOK_REGISTER}
              icon={<BookOpenIcon />}
            />
            <HeaderButton
              title={'리북톡'}
              path={ROUTES.BOOK_REGISTER}
              icon={<ChatBubbleOvalLeftIcon />}
            />
          </nav>
        </div>
      </header>
    </>
  );
}
