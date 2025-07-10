'use client';

import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSearchBooks } from '@/lib/api/books';
import { BookSearchSort } from '@/types/books';
import BookCard from '@/components/book/BookCard';
import Pagination from '@/components/ui/Pagination';
import BookFilters from '@/components/home/BookFilters';
import useBookFilters from '@/hooks/useBookFilters';
import SortControl from '@/components/home/SortControl';
import { useSearchParams } from 'next/navigation';

const PAGE_SIZE = 8;

const RebookMain = () => {
  // const { query } = useSearchStore();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') ?? undefined;
  const { filters, setFilters } = useBookFilters();

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
      'searchBookList',
      searchQuery,
      sortOption,
      filters.statusFilter,
      filters.minPrice,
      filters.maxPrice,
      currentPage,
    ],
    queryFn: async () => {
      return await getSearchBooks({
        search: searchQuery,
        status: filters.statusFilter,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: sortOption,
        page: currentPage,
        limit: PAGE_SIZE,
      });
    },
    placeholderData: keepPreviousData,
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
      <div className="mt-3 flex items-center justify-between">
        {/* 검색 결과 */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">검색 결과</span>
            <span className="text-primary-600 ml-2 text-lg font-semibold">
              {searchBookList?.totalCount || 0}
            </span>
            <span className="text-sm text-gray-600">권</span>
          </div>

          {searchQuery && (
            <span className="text-sm text-gray-500">{`'${searchQuery}' 검색`}</span>
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
