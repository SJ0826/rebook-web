'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import BookFilters from '@/app/(main)/(home)/_components/BookFilters';
import SortControl from '@/app/(main)/(home)/_components/BookFilters/SortControl';
import BookCard from '@/app/(main)/(home)/_components/BookCard';
import Pagination from '@/components/ui/Pagination';
import { getSearchBooks } from '@/lib/api/books';
import { BookSearchSort } from '@/types/books';
import { useBookFilters } from '@/app/(main)/(home)/_hooks';

const PAGE_SIZE = 8;

const RebookMain = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') ?? undefined;
  const { filters, setFilters } = useBookFilters();
  console.log('vercel test');
  const [sortOption, setSortOption] = useState<BookSearchSort>(
    BookSearchSort.NEWEST
  );
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: searchBookList,
    isPending: isPendingBookList,
    isError: isErrorBookList,
  } = useQuery({
    queryKey: [
      'searchBooks',
      searchQuery,
      sortOption,
      filters.statusFilter,
      filters.minPrice,
      filters.maxPrice,
      currentPage,
    ],
    queryFn: async () => {
      return await getSearchBooks({
        searchQuery: searchQuery,
        status: filters.statusFilter,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: sortOption,
        page: currentPage,
        limit: PAGE_SIZE,
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  // 페이지 변경 시 첫 페이지로 리셋
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: BookSearchSort) => {
    setSortOption(sort);
    setCurrentPage(1);
  };

  if (isPendingBookList) return <div>로딩중 ...</div>;
  if (isErrorBookList) return <div>에러... 컴포넌트.. 기능 개발중..</div>;

  return (
    <div className={'mx-auto flex w-full max-w-5xl flex-col gap-2'}>
      {/* 필터 */}

      <BookFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* 검색 결과 및 정렬 */}
      <div className="mt-3 flex-wrap items-center justify-between text-xs lg:text-base">
        {/* 검색 결과 */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg px-3 py-2">
            <span className="text-gray-600 lg:text-sm">검색 결과</span>
            <span className="text-primary-600 ml-2 font-semibold lg:text-lg">
              {searchBookList?.totalCount || 0}
            </span>
            <span className="text-gray-600 lg:text-sm">권</span>
          </div>

          {searchQuery && (
            <span className="text-gray-500 lg:text-sm">{`'${searchQuery}' 검색`}</span>
          )}
        </div>

        {/* 정렬 필터 */}
        <SortControl sortOption={sortOption} onSortChange={handleSortChange} />
      </div>

      {/* 책 목록*/}
      <section>
        {searchBookList?.totalCount > 0 ? (
          <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {searchBookList.books?.map((book) => (
              <BookCard key={`book-card-id-${book.id}`} book={book} />
            ))}
          </div>
        ) : (
          <div>엠티 컴포넌트 기능 개발중</div>
        )}
      </section>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={searchBookList.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RebookMain;
