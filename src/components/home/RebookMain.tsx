'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSearchBooks } from '@/lib/api/books';
import { BookSearchSort } from '@/types/books';

const PAGE_SIZE = 8;

const RebookMain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState<BookSearchSort>(
    BookSearchSort.NEWEST
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: bookList, isPending: isPendingBookList } = useQuery({
    queryKey: [
      'searchBooks',
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
  console.log(bookList);
  return <div></div>;
};

export default RebookMain;
