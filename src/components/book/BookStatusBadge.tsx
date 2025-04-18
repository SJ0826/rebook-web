import React from 'react';
import { twMerge } from 'tailwind-merge';
import { convertBookStatus } from '@/lib/utils/convertLang';
import { BookStatus } from '@/types/books';

interface BookStatusBadgeProps {
  status: BookStatus;
}

const BookStatusBadge = ({ status }: BookStatusBadgeProps) => {
  if (!status) return null;

  return (
    <div
      className={twMerge(
        'badge badge-neutral',
        status === 'NEW' && 'badge-primary',
        status === 'GOOD' && 'badge-secondary',
        status === 'LIKE_NEW' && 'badge-accent',
        status === 'ACCEPTABLE' && 'badge-neutral'
      )}
    >
      {convertBookStatus(status)}
    </div>
  );
};

export default BookStatusBadge;
