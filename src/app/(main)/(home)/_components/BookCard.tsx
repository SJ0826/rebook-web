'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HeartIcon } from '@heroicons/react/16/solid';
import { Book, BookSaleStatus } from '@/types/books';
import { ROUTES } from '@/lib/constants';
import { getTimeAgo } from '@/lib/utils/time';
import BookStatusBadge from '@/app/(main)/book/[id]/_components/BookStatusBadge';
import { twMerge } from 'tailwind-merge';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const router = useRouter();
  const isSold = book.saleStatus === BookSaleStatus.SOLD;
  return (
    <div
      key={book.id}
      onClick={() => router.push(`${ROUTES.BOOK}/${book.id}`)}
      className={twMerge(
        'relative w-full cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white',
        isSold && 'pointer-events-none opacity-60'
      )}
    >
      {/* 이미지 컨테이너 */}
      <div className="relative aspect-[4/4.2] w-full overflow-hidden">
        {book.imageUrls ? (
          <Image
            src={book.imageUrls || '/placeholder.svg'}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-sm text-gray-400">이미지 없음</div>
          </div>
        )}

        {/* 찜 횟수 - 이미지 위에 오버레이 */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
          <HeartIcon className="size-3 text-red-400" />
          <span className="text-xs font-medium text-white">
            {book.favoriteCount ?? 0}
          </span>
        </div>

        {/* 판매 완료 워터마크 오버레이 */}
        {isSold && (
          <div className="bg-gray/10 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl font-bold text-white">판매 완료</span>
          </div>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative space-y-3 p-4">
        {/* 제목 */}
        <h3 className="line-clamp-2 text-base leading-tight text-gray-700">
          {book.title}
        </h3>

        <div className={'flex items-center gap-2'}>
          {/* 가격 */}
          <div className="text-lg font-bold text-gray-900">
            {book.price.toLocaleString()}원
          </div>

          {/* 책 상태 뱃지 */}
          <BookStatusBadge status={book.status} />
        </div>

        {/* 판매 상태 - 메인 페이지가 아닐 때만 표시 */}
        {/*{pathname !== '/' && (*/}
        {/*  <div className="flex items-center">*/}
        {/*    <div*/}
        {/*      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${*/}
        {/*        book.saleStatus === BookSaleStatus.SOLD*/}
        {/*          ? 'border border-red-200 bg-red-50 text-red-600'*/}
        {/*          : 'border border-green-200 bg-green-50 text-green-600'*/}
        {/*      }`}*/}
        {/*    >*/}
        {/*      <div*/}
        {/*        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${*/}
        {/*          book.saleStatus === BookSaleStatus.SOLD*/}
        {/*            ? 'bg-red-500'*/}
        {/*            : 'bg-green-500'*/}
        {/*        }`}*/}
        {/*      />*/}
        {/*      {book.saleStatus === BookSaleStatus.SOLD ? '판매 완료' : '판매중'}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/* 시간 */}
        <div className={'text-sm text-gray-400'}>
          {getTimeAgo(book.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
