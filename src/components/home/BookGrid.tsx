'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BookStatusBadge from '@/components/book/BookStatusBadge';
import { BookSearchOutDto } from '@/types/books';

interface BookGridProps {
  books: BookSearchOutDto[];
}

const BookGrid: React.FC<BookGridProps> = ({ books }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {books?.map((book) => (
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
          <div className="card-body">
            <h2 className="card-title">{book.title}</h2>
            <p className="text-base-content">{book.author}</p>
            <p className="text-[1rem] font-bold text-neutral">
              {book.price.toLocaleString()}원
            </p>
            <div className={'absolute top-3 right-3'}>
              <BookStatusBadge status={book.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
