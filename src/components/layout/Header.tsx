'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import logoImage from '@public/images/logo.png';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import LogoutModal from '@/components/modal/LogoutModal';

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const hideHeader = [ROUTES.LOGIN, ROUTES.SIGNUP].includes(pathname);
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

  if (hideHeader || !isMounted) return null; // 마운트 전에는 렌더링 안함

  return (
    <>
      <header className="navbar bg-base-100 shadow-md fixed top-0 w-full z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            <Image width={46} height={46} src={logoImage} alt={'Rebook logo'} />
            <span className={'hidden md:flex'}>
              Rebook: 다시 읽고 다시 나누다
            </span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={ROUTES.BOOK_REGISTER}
            className="w-20 text-center font-semibold"
          >
            책 등록
          </Link>
          <Link
            href={ROUTES.FAVORITES}
            className="w-20 text-center font-semibold"
          >
            찜 목록
          </Link>
          <Link
            href={ROUTES.PROFILE}
            className="w-20 text-center font-semibold"
          >
            내 정보
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
          <div className="absolute top-16 right-4 w-40 bg-white shadow-lg rounded-md p-3 flex flex-col gap-2 md:hidden">
            <a onClick={handleLoginRoute} className="btn btn-ghost">
              {isLoggedIn ? '로그아웃' : '로그인'}
            </a>
            <Link
              href={ROUTES.BOOK_REGISTER}
              className="btn btn-ghost"
              onClick={() => setIsOpenMobileNav(false)}
            >
              책 등록
            </Link>
            <Link
              href={ROUTES.FAVORITES}
              className="btn btn-ghost"
              onClick={() => setIsOpenMobileNav(false)}
            >
              찜 목록
            </Link>
            <Link
              href={ROUTES.PROFILE}
              className="btn btn-ghost"
              onClick={() => setIsOpenMobileNav(false)}
            >
              내 정보
            </Link>
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
