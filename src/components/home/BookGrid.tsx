'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookSearchOutDto } from '@/types/books';

interface BookGridProps {
  books: BookSearchOutDto[];
}

const BookGrid: React.FC<BookGridProps> = ({ books }) => {
  console.log(books);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books?.map((book) => (
        <div key={book.id} className="card bg-base-100 shadow-lg">
          <figure className="relative h-48">
            <Image
              src={book.imageUrls || '/placeholder.svg'}
              alt={book.title}
              fill
              className="object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{book.title}</h2>
            <p>{book.price.toLocaleString()}원</p>
            <p>{book.status}</p>
            <div className="card-actions justify-end">
              <Link
                href={`/book/${book.id}`}
                className="btn btn-primary btn-sm"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
