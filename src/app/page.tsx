'use client';

import { useState } from 'react';
import FilterOptions from '@/components/home/FilterOptions';
import BookGrid from '@/components/home/BookGrid';
import { useQuery } from '@tanstack/react-query';
import { searchBooksAPI } from '@/lib/api/books';
import { BookSearchOutDto } from '@/types/books';

export default function RebookMain() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // 책 목록 호출
  const { data: books } = useQuery({
    queryKey: [
      'searchBooks',
      searchTerm,
      priceFilter,
      statusFilter,
      sortOption,
    ],
    queryFn: async () =>
      await searchBooksAPI({ search: searchTerm, status: statusFilter }),
  });

  const filteredBooks = (books as BookSearchOutDto[])
    ?.filter((book: BookSearchOutDto) => {
      // 책 제목 검색
      if (
        searchTerm &&
        !book.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      // 가격 필터 (예시: low: 8,000원 미만, mid: 8,000원 ~ 10,000원, high: 10,000원 초과)
      if (priceFilter) {
        if (priceFilter === 'low' && book.price >= 8000) return false;
        if (priceFilter === 'mid' && (book.price < 8000 || book.price > 10000))
          return false;
        if (priceFilter === 'high' && book.price <= 10000) return false;
      }
      // 책 상태 필터
      if (statusFilter && book.status !== statusFilter) return false;
      return true;
    })
    ?.sort((a: BookSearchOutDto, b: BookSearchOutDto) => {
      switch (sortOption) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'highest':
          return b.price - a.price;
        case 'lowest':
          return a.price - b.price;
        default:
          return 0;
      }
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
      <BookGrid books={filteredBooks} />
    </div>
  );
}
