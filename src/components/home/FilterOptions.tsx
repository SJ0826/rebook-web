'use client';

import React from 'react';
import { BookSearchSort, BookStatus } from '@/types/books';

interface FilterOptionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  priceFilter: string;
  setPriceFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOption: BookSearchSort;
  setSortOption: (value: BookSearchSort) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  searchTerm,
  setSearchTerm,
  priceFilter,
  setPriceFilter,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* 책 검색 */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="책 검색"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* 필터 및 정렬 옵션 */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 가격 필터 */}
        <select
          className="select select-bordered"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="" className={'bg-white text-black'}>
            전체 가격
          </option>
          <option value="low">저가 (8,000원 미만)</option>
          <option value="mid">중간가 (8,000원 ~ 10,000원)</option>
          <option value="high">고가 (10,000원 초과)</option>
        </select>
        {/* 책 상태 필터 */}
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">전체 상태</option>
          <option value={BookStatus.NEW}>새책</option>
          <option value={BookStatus.LIKE_NEW}>거의 새책</option>
          <option value={BookStatus.GOOD}>양호</option>
          <option value={BookStatus.ACCEPTABLE}>사용감 있음</option>
        </select>
        {/* 정렬 옵션 */}
        <select
          className="select select-bordered"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as BookSearchSort)}
        >
          <option value={BookSearchSort.NEWEST}>최신순</option>
          <option value={BookSearchSort.PRICE_HIGH}>높은 가격 순</option>
          <option value={BookSearchSort.PRICE_LOW}>낮은 가격 순</option>
          <option value={BookSearchSort.OLDEST}>오래된 순</option>
        </select>
      </div>
    </div>
  );
};

export default FilterOptions;
