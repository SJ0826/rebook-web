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

const SellingBookGrid = ({ books }: SellingBookGridProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {books.map((book) => (
        <div
          key={book.id}
          className="relative bg-white rounded-xl shadow p-4 space-y-3  cursor-pointer
                     hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out"
          onClick={() => router.push(`/book/${book.id}`)}
        >
          <div className="relative w-full h-40">
            <Image
              src={book.imageUrls ?? emptyImage}
              alt={book.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="relative space-y-1">
            <h3 className="text-base font-semibold text-gray-800 truncate">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm text-black font-semibold">
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
                'absolute bottom-0 right-0 flex items-center justify-end gap-2'
              }
            >
              <div className={'flex gap-1 items-center justify-center'}>
                <HeartIcon className={'size-4 text-red-500'} />
                <p className="text-sm text-gray-500">
                  {book.favoriteCount ?? 0}
                </p>
              </div>
              <div className={'flex gap-1 items-center justify-center'}>
                <ChatBubbleBottomCenterIcon className={'size-4'} />
                <p className="text-sm text-gray-500">
                  {book.requestCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellingBookGrid;
