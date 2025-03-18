'use client';

import React from 'react';

interface FilterOptionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  priceFilter: string;
  setPriceFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
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
          <option value="Available">판매 중</option>
          <option value="Sold Out">판매 완료</option>
        </select>
        {/* 정렬 옵션 */}
        <select
          className="select select-bordered"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">최신순</option>
          <option value="highest">높은 가격 순</option>
          <option value="lowest">낮은 가격 순</option>
          <option value="oldest">오래된 순</option>
        </select>
      </div>
    </div>
  );
};

export default FilterOptions;
