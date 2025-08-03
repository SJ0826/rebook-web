'use client';

import React, { useState } from 'react';
import { BookshelfType } from '@/app/(main)/my-bookstore/_type';
import CommonPageLayout from '@/components/layout/CommonPageLayout';
import ProfileCard from '@/app/(main)/my-bookstore/_components/ProfileCard';
import BookListSection from '@/app/(main)/my-bookstore/_components/BookListSection';
import {
  getBuyingBooks,
  getFavoriteBooks,
  getSellingBooks,
} from '@/lib/api/my';
import BookShelfController from '@/app/(main)/my-bookstore/_components/BookShelfController';

const MyBookStore = () => {
  const [activeTab, setActiveTab] = useState<BookshelfType>('sellingBooks');

  return (
    <CommonPageLayout>
      <div className="flex w-full flex-col md:flex-row md:gap-8 md:pt-8">
        {/* ✅ 왼쪽 프로필 카드 & 액션 버튼 */}
        <div className={'flex flex-col items-start md:min-w-[246px]'}>
          {/* 이미지 카드 */}
          <ProfileCard />

          {/* 책장 목록 */}
          <BookShelfController
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* ✅ 오른쪽 책장 컴포넌트 */}
        <div className={'w-full'}>
          {activeTab === 'sellingBooks' && (
            <BookListSection
              fetchBooks={getSellingBooks}
              queryKeyBase="sellingBooks"
            />
          )}
          {activeTab === 'buyingBooks' && (
            <BookListSection
              fetchBooks={getBuyingBooks}
              queryKeyBase="buyingBooks"
            />
          )}
          {activeTab === 'favoriteBooks' && (
            <BookListSection
              fetchBooks={getFavoriteBooks}
              queryKeyBase="favoriteBooks"
            />
          )}
        </div>
      </div>
    </CommonPageLayout>
  );
};

export default MyBookStore;
