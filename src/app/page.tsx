'use client';

import { useState } from 'react';
import FilterOptions from '@/components/home/FilterOptions';
import BookGrid from '@/components/home/BookGrid';
import { useQuery } from '@tanstack/react-query';
import { searchBooksAPI } from '@/lib/api/books';
import { BookSearchSort } from '@/types/books';

export default function RebookMain() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState<BookSearchSort>(
    BookSearchSort.NEWEST
  );

  // 책 목록 호출
  const { data: books } = useQuery({
    queryKey: [
      'searchBooks',
      searchTerm,
      priceFilter,
      statusFilter,
      sortOption,
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
      return await searchBooksAPI({
        search: searchTerm,
        status: statusFilter,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sort: sortOption,
      });
    },
  });

  return (
    <div className="container mx-auto p-4">
      <FilterOptions
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <BookGrid books={books ?? []} />
    </div>
  );
}
