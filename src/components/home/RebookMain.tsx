'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSearchBooks } from '@/lib/api/books';
import { BookSearchSort } from '@/types/books';
import BookCard from '@/components/book/BookCard';

const PAGE_SIZE = 8;

const RebookMain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
      searchTerm,
      priceFilter,
      statusFilter,
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
      return await getSearchBooks({
        search: searchTerm,
        status: statusFilter,
        minPrice: minPrice,
        maxPrice: maxPrice,
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
    <div className={'mx-auto flex max-w-5xl flex-col gap-8'}>
      {/* 필터 */}
      <section>filters</section>

      {/* 책 목록*/}
      <section className="grid grid-cols-4 gap-8">
        {searchBookList.books?.map((book) => (
          <BookCard key={`book-card-id-${book.id}`} book={book} />
        ))}
      </section>
    </div>
  );
};

export default RebookMain;
