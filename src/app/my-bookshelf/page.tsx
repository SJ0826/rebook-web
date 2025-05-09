'use client';

import { useState } from 'react';
import SellingBooks from '@/components/bookShelf/SellingBooks';
import FavoriteBooks from '@/components/bookShelf/FavoriteBooks';
import BuyingBooks from '@/components/bookShelf/BuyingBooks';
import ProfileCard from '@/components/bookShelf/ProfileCard';

export default function MyBookshelfPage() {
  const [activeTab, setActiveTab] = useState<
    'sellingBooks' | 'buyingBooks' | 'favoriteBooks'
  >('sellingBooks');

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl md:text-3xl font-bold">📚 나의 서재</h1>
      {/* 프로필 카드 */}
      <ProfileCard />

      {/*활동 내역*/}
      <div role="tablist" className="tabs tabs-border md:tabs-lg">
        <button
          role="tab"
          className={`tab ${activeTab === 'sellingBooks' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('sellingBooks')}
        >
          📘 판매 책장
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === 'buyingBooks' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('buyingBooks')}
        >
          📗 구매 책장
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === 'favoriteBooks' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('favoriteBooks')}
        >
          ❤️ 관심 책장
        </button>
      </div>

      {/* 책장 */}
      <SellingBooks isActive={activeTab === 'sellingBooks'} />
      <BuyingBooks isActive={activeTab === 'buyingBooks'} />
      <FavoriteBooks isActive={activeTab === 'favoriteBooks'} />
    </div>
  );
}
