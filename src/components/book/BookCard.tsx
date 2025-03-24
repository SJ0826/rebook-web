'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/16/solid';
import BookStatusBadge from '@/components/book/BookStatusBadge';
import { Book, BookSaleStatus } from '@/types/books';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      key={book.id}
      onClick={() => router.push(`/book/${book.id}`)}
      className="relative card bg-base-100 shadow-lg cursor-pointer
                     hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out"
    >
      <figure className="relative h-48">
        {book.imageUrls ? (
          <Image
            src={book.imageUrls || '/placeholder.svg'}
            alt={book.title}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className={'w-full h-full bg-gray-200'} />
        )}
      </figure>
      <div className=" card-body">
        <h2 className="card-title">{book.title}</h2>
        <p className="text-base-content">{book.author}</p>
        <p className="text-[1rem] font-bold text-neutral">
          {book.price.toLocaleString()}원
        </p>

        {/* 판매 상태 표시 - 메인 페이지('/')에서는 숨김 */}
        {pathname !== '/' && (
          <p
            className={`text-sm font-medium ${
              book.saleStatus === BookSaleStatus.SOLD
                ? 'text-red-500'
                : 'text-green-600'
            }`}
          >
            {book.saleStatus === BookSaleStatus.SOLD ? '판매 완료' : '판매중'}
          </p>
        )}

        {/*  거래 요청 횟수 */}
        <div
          className={
            'absolute bottom-6 right-6 flex items-center justify-end gap-2'
          }
        >
          <div className={'flex gap-1 items-center justify-center'}>
            <HeartIcon className={'size-4 text-red-500'} />
            <p className="text-sm text-gray-500">{book.favoriteCount ?? 0}</p>
          </div>
          <div className={'flex gap-1 items-center justify-center'}>
            <ChatBubbleBottomCenterIcon className={'size-4'} />
            <p className="text-sm text-gray-500">{book.orderCount ?? 0}</p>
          </div>
        </div>
        <div className={'absolute top-3 right-3'}>
          <BookStatusBadge status={book.status} />
        </div>
      </div>
    </div>
  );
};

export default BookCard;
