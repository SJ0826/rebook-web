'use client';

import { useState } from 'react';
import Image from 'next/image';
import logoImage from '@public/images/logo.png';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar bg-base-100 shadow-md fixed top-0 w-full z-50">
      {/* 왼쪽: 로고 */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <Image width={46} height={46} src={logoImage} alt={'Rebook logo'} />
          <span className={'hidden md:flex'}>
            Rebook: 다시 읽고 다시 나누다
          </span>
        </a>
      </div>

      {/* 데스크톱 메뉴 */}
      <div className="hidden md:flex gap-4">
        <a className="btn btn-ghost">책 등록</a>
        <a className="btn btn-ghost">찜 목록</a>
        <a className="btn btn-ghost">내 정보</a>
        <a className="btn btn-ghost" href={'/login'}>
          로그인
        </a>
      </div>

      {/* 모바일 메뉴 버튼 */}
      <button
        className="btn btn-ghost md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* 모바일 메뉴 (drawer) */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-40 bg-white shadow-lg rounded-md p-3 flex flex-col gap-2 md:hidden">
          <a className="btn btn-ghost" onClick={() => setIsOpen(false)}>
            책 등록
          </a>
          <a className="btn btn-ghost" onClick={() => setIsOpen(false)}>
            찜 목록
          </a>
          <a className="btn btn-ghost">내 정보</a>
        </div>
      )}
    </header>
  );
}
