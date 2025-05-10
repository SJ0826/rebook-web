'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FilterOptions from '@/components/home/FilterOptions';
import BookGrid from '@/components/home/BookGrid';
import { useQuery } from '@tanstack/react-query';
import { searchBooksAPI } from '@/lib/api/books';
import { BookSearchSort } from '@/types/books';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { triggerToast } from '@/lib/contexts/ToastContext';

const PAGE_SIZE = 8;

export default function RebookMain() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState<BookSearchSort>(
    BookSearchSort.NEWEST
  );
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // 책 목록 호출
  const { data } = useQuery({
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
      return await searchBooksAPI({
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
  const books = data?.books ?? [];
  const totalPages = data?.totalPages ?? 1;
  return (
    <div className="bg-base-100 container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 w-full rounded-xl bg-yellow-100 p-6 shadow-md"
      >
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-yellow-900">
              중고책 거래의 시작, <span className="text-primary">ReBook</span>
            </h1>
            <p className="mt-2 text-lg text-yellow-800">
              읽지 않는 책, ReBook에서 새 주인을 찾아주세요!
            </p>
            <button
              className="btn btn-primary btn-sm mt-4"
              onClick={() => {
                if (!isLoggedIn) {
                  triggerToast('로그인이 필요한 서비스입니다', 'info');
                  return;
                }

                router.push(ROUTES.BOOK_REGISTER);
              }}
            >
              책 등록하기 →
            </button>
          </div>

          <div className="hidden text-yellow-600 md:block">
            <SparklesIcon className="h-20 w-20" />
          </div>
        </div>
      </motion.div>
      {/* 필터 옵션 */}
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

      {/* 책 목록 */}
      <BookGrid books={books} />

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

          {Array.from({ length: totalPages }, (_, i) => (
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
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
