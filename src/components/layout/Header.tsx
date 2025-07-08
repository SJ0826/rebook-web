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
  const router = useRouter();
  const pathname = usePathname();
  const { logout, isLoggedIn } = useAuth();
  const { query, setQuery } = useSearchStore();

  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const hideHeader = noAuthRoutes.includes(pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (hideHeader || !isMounted) return null;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 px-10 py-7">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

        {/*{isOpenMobileNav && (*/}
        {/*  <div className="absolute top-16 right-4 flex w-40 flex-col gap-2 rounded-md bg-white p-3 shadow-lg md:hidden">*/}
        {/*    <a onClick={handleLoginRoute} className="btn btn-ghost">*/}
        {/*      {isLoggedIn ? '로그아웃' : '로그인'}*/}
        {/*    </a>*/}
        {/*    <Link*/}
        {/*      href={'#'}*/}
        {/*      className="btn btn-ghost"*/}
        {/*      onClick={(e) => {*/}
        {/*        e.preventDefault();*/}
        {/*        handleRouteWithAuth(ROUTES.BOOK_REGISTER);*/}
        {/*        setIsOpenMobileNav(false);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      책 등록*/}
        {/*    </Link>*/}
        {/*    <Link*/}
        {/*      href={'#'}*/}
        {/*      className="btn btn-ghost"*/}
        {/*      onClick={(e) => {*/}
        {/*        e.preventDefault();*/}
        {/*        handleRouteWithAuth(ROUTES.MY_BOOKSHELF);*/}
        {/*        setIsOpenMobileNav(false);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      나의 서재*/}
        {/*    </Link>*/}
        {/*    /!*<Link*!/*/}
        {/*    /!*  href={'#'}*!/*/}
        {/*    /!*  className="btn btn-ghost"*!/*/}
        {/*    /!*  onClick={(e) => {*!/*/}
        {/*    /!*    e.preventDefault();*!/*/}
        {/*    /!*    handleRouteWithAuth(ROUTES.PROFILE);*!/*/}
        {/*    /!*    setIsOpenMobileNav(false);*!/*/}
        {/*    /!*  }}*!/*/}
        {/*    /!*>*!/*/}
        {/*    /!*  내 정보*!/*/}
        {/*    /!*</Link>*!/*/}
        {/*  </div>*/}
        {/*)}*/}
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
