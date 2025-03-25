'use client';

import { useParams } from 'next/navigation';
import { BookForm } from '@/app/book/edit/[id]/BookForm';

export default function EditBookPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto max-w-[1024px] p-6 bg-base-100 ">
      <BookForm id={Number(id)} />
    </div>
  );
}
