import React from 'react';
import { Book } from '@/types/books';
import BookCard from '@/components/book/BookCard';

interface BookGridProps {
  books: Book[];
}

const BookGrid: React.FC<BookGridProps> = ({ books }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {books?.map((book) => (
        <BookCard key={`book-card-id-${book.id}`} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
