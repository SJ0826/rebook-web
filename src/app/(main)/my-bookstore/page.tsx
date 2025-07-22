'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import CommonPageLayout from '@/components/layout/CommonPageLayout';
import ProfileCard from '@/app/(main)/my-bookstore/_components/ProfileCard';
import { ROUTES } from '@/lib/constants';
import { useToast } from '@/lib/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { useModalStack } from '@/hooks/useModalStack';
import {
  ArrowLeftEndOnRectangleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { BookshelfType } from '@/app/(main)/my-bookstore/_type';
import BookListSection from '@/app/(main)/my-bookstore/_components/BookListSection';
import { getSellingBooks } from '@/lib/api/my';

const bookShelfList: { label: string; key: BookshelfType }[] = [
  { label: '판매 책장', key: 'sellingBooks' },
  { label: '구매 책장', key: 'buyingBooks' },
  { label: '좋아요 책장', key: 'favoriteBooks' },
];

export default function MyBookshelfPage() {
  const [activeTab, setActiveTab] = useState<BookshelfType>('sellingBooks');

  const { logout } = useAuth();
  const router = useRouter();
  const { clear } = useModalStack();
  const { showToast } = useToast();
  // 로그아웃 핸들러
  const handleLogout = async () => {
    logout();
    clear();
    router.push(ROUTES.HOME);
    showToast('로그아웃에 성공했습니다', 'success');
  };

  return (
    <CommonPageLayout>
      <div className="flex w-full flex-col md:flex-row md:gap-4 md:pt-8">
        {/* 왼쪽 프로필 카드 & 액션 버튼 */}
        <div className={'flex flex-col items-start md:min-w-[246px]'}>
          {/* 이미지 카드 */}
          <ProfileCard />

          <div className={'my-4 h-[1px] w-full border-t border-gray-200'} />

          {/* 책장 목록 */}
          <ul className={'flex flex-col gap-4'}>
            {bookShelfList.map((bookShelf) => (
              <li
                key={bookShelf.key}
                onClick={() => setActiveTab(bookShelf.key)}
                className={twMerge(
                  'p-2 pl-6 text-lg font-semibold transition hover:cursor-pointer',
                  activeTab === bookShelf.key
                    ? 'text-black underline underline-offset-4'
                    : 'text-gray-400'
                )}
              >
                {bookShelf.label}
              </li>
            ))}
          </ul>

          <div className={'my-4 h-[1px] w-full border-t border-gray-200'} />

          {/* 액션 버튼 */}
          <div className={'flex w-full flex-col gap-2'}>
            <Button variant={'line-sub'} color={'gray'} className={'flex-1'}>
              <PencilSquareIcon width={16} className={'mr-2'} />
              프로필 수정
            </Button>
            <Button
              variant={'line-sub'}
              color={'gray'}
              className={'flex-1'}
              onClick={handleLogout}
            >
              <ArrowLeftEndOnRectangleIcon width={16} className={'mr-2'} />
              <p>로그아웃</p>
            </Button>
          </div>

          <div className={'my-4 flex w-full flex-col items-end'}>
            <div className={'h-[1px] w-full border-t border-gray-200'} />
            <Button
              variant={'line-none'}
              className={'px-1 text-sm text-gray-500'}
            >
              회원 탈퇴하기
            </Button>
          </div>
        </div>

        {/* 오른쪽 책장 컴포넌트 */}
        <div className={'w-full'}>
          {activeTab === 'sellingBooks' && (
            <BookListSection
              fetchBooks={getSellingBooks}
              queryKeyBase="sellingBooks"
            />
          )}
        </div>

        {/*  /!* 책장 *!/*/}
        {/*  <SellingBooks isActive={activeTab === 'sellingBooks'} />*/}
        {/*  <BuyingBooks isActive={activeTab === 'buyingBooks'} />*/}
        {/*  <FavoriteBooks isActive={activeTab === 'favoriteBooks'} />*/}
        {/*  <div className={'flex flex-col'}>*/}
        {/*    <Button*/}
        {/*      className="w-fit"*/}
        {/*      size={'sm'}*/}
        {/*      variant={'line-sub'}*/}
        {/*      color={'gray'}*/}
        {/*    >*/}
        {/*      회원탈퇴*/}
        {/*    </Button>*/}
        {/*  </div>*/}
      </div>
    </CommonPageLayout>
  );
}
