import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number; // 표시할 페이지 수 (기본값: 5)
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPages = 5,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages = [];
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(1, currentPage - halfShow);
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    // 끝 페이지가 부족하면 시작 페이지 조정
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
          currentPage === 1
            ? 'cursor-not-allowed border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* 첫 페이지 (생략 표시가 있을 때) */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="flex h-10 w-10 items-center justify-center text-gray-400">
              ...
            </span>
          )}
        </>
      )}

      {/* 페이지 번호들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
            currentPage === page
              ? 'border-blue-500 bg-blue-50 font-medium text-blue-600'
              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 (생략 표시가 있을 때) */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="flex h-10 w-10 items-center justify-center text-gray-400">
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
          currentPage === totalPages
            ? 'cursor-not-allowed border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
