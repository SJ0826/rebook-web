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
      className="relative"
    >
      <figure>
        {book.imageUrls ? (
          <Image
            src={book.imageUrls || '/placeholder.svg'}
            alt={book.title}
            fill
            className="rounded-t-lg object-cover"
          />
        ) : (
          <div className={'h-full w-full bg-gray-200'} />
        )}
      </figure>
      <div>
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <p>{book.price.toLocaleString()}원</p>

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
            'absolute right-6 bottom-6 flex items-center justify-end gap-2'
          }
        >
          <div className={'flex items-center justify-center gap-1'}>
            <HeartIcon className={'size-4 text-red-500'} />
            <p className="text-sm text-gray-500">{book.favoriteCount ?? 0}</p>
          </div>
          <div className={'flex items-center justify-center gap-1'}>
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
