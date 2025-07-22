'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/16/solid';
import { BookSaleStatus, SellingBook } from '@/types/books';
import emptyImage from '@public/images/empty.png';

interface SellingBookGridProps {
  books: SellingBook[];
}

const BookGrid = ({ books }: SellingBookGridProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {books.map((book) => (
        <div
          key={book.id}
          className="relative cursor-pointer space-y-3 rounded-xl bg-white p-4 shadow transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
          onClick={() => router.push(`/book/${book.id}`)}
        >
          <div className="relative h-40 w-full">
            <Image
              src={book.imageUrls ?? emptyImage}
              alt={book.title}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="relative space-y-1">
            <h3 className="truncate text-base font-semibold text-gray-800">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm font-semibold text-black">
              {book.price.toLocaleString()}원
            </p>

            {/*  판매 상태 표시 */}
            <p
              className={`text-sm font-medium ${
                book.saleStatus === BookSaleStatus.SOLD
                  ? 'text-red-500'
                  : 'text-green-600'
              }`}
            >
              {book.saleStatus === BookSaleStatus.SOLD ? '판매 완료' : '판매중'}
            </p>

            {/*  거래 요청 횟수 */}
            <div
              className={
                'absolute right-0 bottom-0 flex items-center justify-end gap-2'
              }
            >
              <div className={'flex items-center justify-center gap-1'}>
                <HeartIcon className={'size-4 text-red-500'} />
                <p className="text-sm text-gray-500">
                  {book.favoriteCount ?? 0}
                </p>
              </div>
              <div className={'flex items-center justify-center gap-1'}>
                <ChatBubbleBottomCenterIcon className={'size-4'} />
                <p className="text-sm text-gray-500">{book.orderCount ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
