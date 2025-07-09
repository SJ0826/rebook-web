import React from 'react';
import { BookStatus } from '@/types/books';
import { convertBookStatus } from '@/lib/utils/convert';

interface BookStatusBadgeProps {
  status: BookStatus;
}

const BookStatusBadge = ({ status }: BookStatusBadgeProps) => {
  if (!status) return null;

  const getStatusStyle = (status: BookStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LIKE_NEW':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'GOOD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACCEPTABLE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex min-w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(status)}`}
    >
      {convertBookStatus(status)}
    </span>
  );
};

export default BookStatusBadge;
