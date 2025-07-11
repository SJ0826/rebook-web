'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Book,
  BookSaleStatus,
  BookSearchSort,
  BookStatus,
} from '@/types/books';
import {
  priceOption,
  saleStatusOptions,
  sortOptions,
  statusOptions,
} from '@/lib/data/options';
import BookGrid from '@/components/bookShelf/BookGrid';

interface BookListSectionProps {
  isActive: boolean;
  fetchBooks: (params: {
    status?: BookStatus;
    saleStatus?: BookSaleStatus;
    minPrice?: number;
    maxPrice?: number;
    sort: BookSearchSort;
    page: number;
    limit: number;
  }) => Promise<{
    books: Book[];
    totalCount: number;
    totalPages: number;
  }>;
  queryKeyBase: string;
  EmptyState: React.FC<{ isShow: boolean }>;
}

const PAGE_SIZE = 8;

const BookListSection = ({
  isActive,
  fetchBooks,
  queryKeyBase,
  EmptyState,
}: BookListSectionProps) => {
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookStatus | ''>('');
  const [saleStatusFilter, setSaleStatusFilter] = useState<BookSaleStatus | ''>(
    ''
  );
  const [sortOption, setSortOption] = useState<BookSearchSort>(
    BookSearchSort.NEWEST
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useQuery({
    queryKey: [
      queryKeyBase,
      priceFilter,
      statusFilter,
      saleStatusFilter,
      sortOption,
      currentPage,
    ],
    queryFn: async () => {
      let minPrice, maxPrice;
      if (priceFilter === 'low') {
        minPrice = 0;
        maxPrice = 8000;
      } else if (priceFilter === 'mid') {
        minPrice = 8000;
        maxPrice = 10000;
      } else if (priceFilter === 'high') {
        minPrice = 10000;
      }
      return await fetchBooks({
        status: statusFilter || undefined,
        saleStatus: saleStatusFilter || undefined,
        minPrice,
        maxPrice,
        sort: sortOption,
        page: currentPage,
        limit: PAGE_SIZE,
      });
    },
  });

  if (!isActive) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* 필터 */}
      <div className="flex flex-col items-start justify-start gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-4 md:flex-row">
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

          <select
            className="select select-bordered"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as BookSearchSort)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 책 리스트 */}
      <BookGrid books={data?.books ?? []} />
      <EmptyState isShow={data?.totalCount === 0} />

      {/* 페이지네이션 */}
      <div className="mt-10 flex justify-center">
        <div className="join">
          <button
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          {Array.from({ length: data?.totalPages ?? 0 }, (_, i) => (
            <button
              key={i}
              className={`join-item btn ${currentPage === i + 1 ? 'btn-primary' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="join-item btn"
            onClick={() =>
              setCurrentPage((prev) =>
                prev < (data?.totalPages ?? 0) ? prev + 1 : prev
              )
            }
            disabled={currentPage === data?.totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookListSection;
