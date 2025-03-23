'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSellingBooks } from '@/lib/api/my';
import SellingBookGrid from '@/app/my-bookshelf/SellingBookGrid';
import { BookSaleStatus, BookSearchSort, BookStatus } from '@/types/books';
import Image from 'next/image';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import emptyImage from '@public/images/empty.png';

const PAGE_SIZE = 8;

interface SellingBooksProps {
  isActive: boolean;
}
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
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-6">
        <div className="relative w-40 h-40">
          <Image
            src={emptyImage}
            alt="ReBook Logo"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800">
          판매 중인 책이 없어요
        </h2>
        <p className="text-gray-500">
          등록된 책이 없어요. 지금 바로 첫 책을 등록해보세요!
        </p>
        <button
          onClick={() => router.push(ROUTES.BOOK_REGISTER)}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow hover:bg-yellow-300 transition"
        >
          책 등록하기
        </button>
      </div>
    );
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
            <option value="" className={'bg-white text-black'}>
              전체 가격
            </option>
            <option value="low">저가 (8,000원 미만)</option>
            <option value="mid">중간가 (8,000원 ~ 10,000원)</option>
            <option value="high">고가 (10,000원 초과)</option>
          </select>
          {/* 책 상태 필터 */}
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookStatus | '')}
          >
            <option value="">전체 상태</option>
            <option value={BookStatus.NEW}>새책</option>
            <option value={BookStatus.LIKE_NEW}>거의 새책</option>
            <option value={BookStatus.GOOD}>양호</option>
            <option value={BookStatus.ACCEPTABLE}>사용감 있음</option>
          </select>
          {/* 책 판매 상태 필터 */}
          <select
            className="select select-bordered"
            value={saleStatusFilter}
            onChange={(e) =>
              setSaleStatusFilter(e.target.value as BookSaleStatus | '')
            }
          >
            <option value="">전체 판매 상태</option>
            <option value={BookSaleStatus.FOR_SALE}>판매중</option>
            <option value={BookSaleStatus.SOLD}>판매 완료</option>
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
