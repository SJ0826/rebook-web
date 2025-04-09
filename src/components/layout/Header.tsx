'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import logoImage from '@public/images/logo.png';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import LogoutModal from '@/components/modal/LogoutModal';
import { useToast } from '@/lib/contexts/ToastContext';
import { noAuthRoutes } from '@/lib/data/noAuthRoutes';

export default function Header() {
  const pathname = usePathname();
  const { logout, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const hideHeader = noAuthRoutes.includes(pathname);
  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLoginRoute = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
      return;
    }
    router.push(ROUTES.LOGIN);
  };

  // 로그인 여부에 따라 이동 or 토스트
  const handleRouteWithAuth = (route: string) => {
    if (isLoggedIn) {
      router.push(route);
    } else {
      showToast('로그인이 필요한 서비스입니다.', 'info');
      router.push(ROUTES.LOGIN);
    }
  };

  if (hideHeader || !isMounted) return null;

  return (
    <>
      <header className="navbar bg-base-100 fixed top-0 z-50 w-full shadow-md">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href={ROUTES.HOME}>
            <Image
              width={46}
              height={46}
              src={logoImage}
              alt={'Rebook logo'}
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className={'hidden md:flex'}>
              Rebook: 다시 읽고 다시 나누다
            </span>
          </a>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href={'#'}
            onClick={(e) => {
              e.preventDefault();
              handleRouteWithAuth(ROUTES.BOOK_REGISTER);
            }}
            className="w-20 text-center font-semibold"
          >
            책 등록
          </Link>
          <Link
            href={'#'}
            onClick={(e) => {
              e.preventDefault();
              handleRouteWithAuth(ROUTES.MY_BOOKSHELF);
            }}
            className="w-20 text-center font-semibold"
          >
            나의 서재
          </Link>
          <Link
            href={'#'}
            onClick={(e) => {
              e.preventDefault();
              handleRouteWithAuth(ROUTES.CHAT);
            }}
            className="w-20 text-center font-semibold"
          >
            채팅
          </Link>
          <button
            onClick={handleLoginRoute}
            className="w-20 text-center font-semibold"
          >
            {isLoggedIn ? '로그아웃' : '로그인'}
          </button>
        </nav>
        <button
          className="btn btn-ghost md:hidden"
          onClick={() => setIsOpenMobileNav((prev) => !prev)}
        >
          ☰
        </button>

        {isOpenMobileNav && (
          <div className="absolute top-16 right-4 flex w-40 flex-col gap-2 rounded-md bg-white p-3 shadow-lg md:hidden">
            <a onClick={handleLoginRoute} className="btn btn-ghost">
              {isLoggedIn ? '로그아웃' : '로그인'}
            </a>
            <Link
              href={'#'}
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                handleRouteWithAuth(ROUTES.BOOK_REGISTER);
                setIsOpenMobileNav(false);
              }}
            >
              책 등록
            </Link>
            <Link
              href={'#'}
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                handleRouteWithAuth(ROUTES.MY_BOOKSHELF);
                setIsOpenMobileNav(false);
              }}
            >
              나의 서재
            </Link>
            {/*<Link*/}
            {/*  href={'#'}*/}
            {/*  className="btn btn-ghost"*/}
            {/*  onClick={(e) => {*/}
            {/*    e.preventDefault();*/}
            {/*    handleRouteWithAuth(ROUTES.PROFILE);*/}
            {/*    setIsOpenMobileNav(false);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  내 정보*/}
            {/*</Link>*/}
          </div>
        )}
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
