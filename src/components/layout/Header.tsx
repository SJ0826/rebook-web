'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import logoImage from '@public/images/logo.png';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import LogoutModal from '@/components/modal/LogoutModal';
import { noAuthRoutes } from '@/lib/data/noAuthRoutes';
import { Input } from '@/components/ui';
import HeaderButton from '@/components/home/HeaderButton';
import {
  BookOpenIcon,
  BuildingStorefrontIcon,
  ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/outline';
import { useSearchStore } from '@/lib/store/search';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoggedIn } = useAuth();
  const { query, setQuery } = useSearchStore();

  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tempKeyword, setTempKeyword] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const hideHeader = noAuthRoutes.includes(pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 엔터 키 핸들러
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 홈 페이지가 아니면 홈으로 이동
      if (pathname !== ROUTES.HOME) {
        router.push(ROUTES.HOME);
      }

      setQuery(tempKeyword);
    }
  };

  // 클리어 핸들러
  const handleClear = () => {
    setTempKeyword('');
    setQuery('');
  };

  if (hideHeader || !isMounted) return null;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white px-10 py-7">
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
            onKeyPress={handleSearchKeyPress}
            onClear={handleClear}
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
              title={'리북 톡'}
              path={ROUTES.BOOK_REGISTER}
              icon={<ChatBubbleOvalLeftIcon />}
            />
          </nav>
        </div>
      </header>
      {showLogoutModal && (
        <LogoutModal
          setShowLogoutModal={setShowLogoutModal}
          handleLogoutConfirm={() => {
            logout();
            setShowLogoutModal(false);
            setIsOpenMobileNav(false);
          }}
        />
      )}
    </>
  );
}
