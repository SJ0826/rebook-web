'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSearchBooks } from '@/lib/api/books';
import { BookSearchSort } from '@/types/books';
import BookCard from '@/components/book/BookCard';
import Pagination from '@/components/ui/Pagination';
import BookFilters from '@/components/home/BookFilters';
import useBookFilters from '@/hooks/useBookFilters';
import { useSearchStore } from '@/lib/store/search';
import SortControl from '@/components/home/SortControl';

const PAGE_SIZE = 8;

const RebookMain = () => {
  const { query } = useSearchStore();
  const [sortOption, setSortOption] = useState<BookSearchSort>(
    BookSearchSort.NEWEST
  );
  const { filters, updateFilter, resetFilters, setFilters } = useBookFilters();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: searchBookList,
    isPending: isPendingBookList,
    isError: isErrorBookList,
  } = useQuery({
    queryKey: [
      'searchBookList',
      filters.sortOption,
      filters.statusFilter,
      currentPage,
    ],
    queryFn: async () => {
      return await getSearchBooks({
        search: query,
        status: filters.statusFilter,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: sortOption,
        page: currentPage,
        limit: PAGE_SIZE,
      });
    },
  });

  if (isPendingBookList) return <div>로딩중 ...</div>;
  if (isErrorBookList) return <div>에러... 컴포넌트.. 기능 개발중..</div>;
  if (!searchBookList?.totalPages) return <div>엠티 컴포넌트 기능 개발중</div>;

  return (
    <div className={'mx-auto flex w-full max-w-5xl flex-col gap-8'}>
      {/* 필터 */}
      <BookFilters filters={filters} onFiltersChange={setFilters} />

      {/* 정렬 */}

      {/* 정렬 필터 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">정렬</h3>
        <SortControl
          sortOption={filters.sortOption}
          onSortChange={(sort: BookSearchSort) => setSortOption(sort)}
        />
      </div>

      {/* 책 목록*/}
      <section className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {searchBookList.books?.map((book) => (
          <BookCard key={`book-card-id-${book.id}`} book={book} />
        ))}
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
