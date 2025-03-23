'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import SellingBookGrid from '@/components/bookShelf/SellingBookGrid';
import EmptySellingBooks from '@/components/bookShelf/EmptySellingBooks';

import { getSellingBooks } from '@/lib/api/my';
import { BookSaleStatus, BookSearchSort, BookStatus } from '@/types/books';

const PAGE_SIZE = 8;

interface SellingBooksProps {
  isActive: boolean;
}

const priceOption = [
  { value: '', label: '전체 상태' },

  {
    value: 'low',
    label: '저가 (8,000원 미만)',
  },
  {
    value: 'mid',
    label: '중간가 (8,000원 ~ 10,000원)',
  },
  {
    value: 'high',
    label: '고가 (10,000원 초과)',
  },
];

const statusOptions = [
  { value: '', label: '전체 상태' },
  { value: BookStatus.NEW, label: '새책' },
  { value: BookStatus.LIKE_NEW, label: '거의 새책' },
  { value: BookStatus.GOOD, label: '양호' },
  { value: BookStatus.ACCEPTABLE, label: '사용감 있음' },
];

const saleStatusOptions = [
  { value: '', label: '전체 판매 상태' },
  { value: BookSaleStatus.FOR_SALE, label: '판매중' },
  { value: BookSaleStatus.SOLD, label: '판매 완료' },
];

const sortOptions = [
  { value: BookSearchSort.NEWEST, label: '최신순' },
  { value: BookSearchSort.PRICE_HIGH, label: '높은 가격 순' },
  { value: BookSearchSort.PRICE_LOW, label: '낮은 가격 순' },
  { value: BookSearchSort.OLDEST, label: '오래된 순' },
];

const SellingBooks = ({ isActive }: SellingBooksProps) => {
  const router = useRouter();
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookStatus | ''>('');
  const [saleStatusFilter, setSaleStatusFilter] = useState<BookSaleStatus | ''>(
    ''
  );
  const [sortOption, setSortOption] = useState<BookSearchSort>(
    BookSearchSort.NEWEST
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: sellingBooks } = useQuery({
    queryKey: [
      'sellingBooks',
      priceFilter,
      statusFilter,
      saleStatusFilter,
      sortOption,
      currentPage,
    ],
    queryFn: async () => {
      let minPrice = undefined;
      let maxPrice = undefined;
      if (priceFilter === 'low') {
        minPrice = 0;
        maxPrice = 8000;
      }
      if (priceFilter === 'mid') {
        minPrice = 8000;
        maxPrice = 10000;
      }
      if (priceFilter === 'high') {
        minPrice = 10000;
      }
      return await getSellingBooks({
        status: statusFilter || undefined,
        saleStatus: saleStatusFilter || undefined,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sort: sortOption,
        page: currentPage,
        limit: PAGE_SIZE,
      });
    },
  });

  if (!isActive) return;
  if (!sellingBooks?.books) {
    return <EmptySellingBooks />;
  }

  return (
    <div className={'flex flex-col  gap-6'}>
      {/* 필터링 바 */}
      <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4">
        {/* 필터 및 정렬 옵션 */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* 가격 필터 */}
          <select
            className="select select-bordered"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            {priceOption.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* 책 상태 필터 */}
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookStatus | '')}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* 책 판매 상태 필터 */}
          <select
            className="select select-bordered"
            value={saleStatusFilter}
            onChange={(e) =>
              setSaleStatusFilter(e.target.value as BookSaleStatus | '')
            }
          >
            {saleStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
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

      {/* 책 리스트 */}
      <SellingBookGrid books={sellingBooks?.books ?? []} />

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-10">
        <div className="join">
          <button
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>

          {Array.from({ length: sellingBooks.totalPages }, (_, i) => (
            <button
              key={i}
              className={`join-item btn ${
                currentPage === i + 1 ? 'btn-primary' : ''
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="join-item btn"
            onClick={() =>
              setCurrentPage((prev) =>
                prev < sellingBooks.totalPages ? prev + 1 : prev
              )
            }
            disabled={currentPage === sellingBooks.totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellingBooks;
