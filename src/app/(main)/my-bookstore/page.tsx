'use client';

import React, { useState } from 'react';
import CommonPageLayout from '@/components/layout/CommonPageLayout';
import ProfileCard from '@/app/(main)/my-bookstore/_components/ProfileCard';

export default function MyBookshelfPage() {
  const [activeTab, setActiveTab] = useState<
    'sellingBooks' | 'buyingBooks' | 'favoriteBooks'
  >('sellingBooks');

  return (
    <CommonPageLayout>
      <div className="flex w-full flex-col md:flex-row md:pt-8">
        <ProfileCard />

        {/*<div className={'h-[1px] w-full border-t border-gray-200'} />*/}

        {/*활동 내역*/}
        {/*  <div role="tablist">*/}
        {/*    <button*/}
        {/*      role="tab"*/}
        {/*      className={`tab ${activeTab === 'sellingBooks' ? 'tab-active' : ''}`}*/}
        {/*      onClick={() => setActiveTab('sellingBooks')}*/}
        {/*    >*/}
        {/*      📘 판매 책장*/}
        {/*    </button>*/}
        {/*    <button*/}
        {/*      role="tab"*/}
        {/*      className={`tab ${activeTab === 'buyingBooks' ? 'tab-active' : ''}`}*/}
        {/*      onClick={() => setActiveTab('buyingBooks')}*/}
        {/*    >*/}
        {/*      📗 구매 책장*/}
        {/*    </button>*/}
        {/*    <button*/}
        {/*      role="tab"*/}
        {/*      className={`tab ${activeTab === 'favoriteBooks' ? 'tab-active' : ''}`}*/}
        {/*      onClick={() => setActiveTab('favoriteBooks')}*/}
        {/*    >*/}
        {/*      ❤️ 관심 책장*/}
        {/*    </button>*/}
        {/*  </div>*/}

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
