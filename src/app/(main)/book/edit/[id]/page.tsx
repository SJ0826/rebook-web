'use client';

import { useParams } from 'next/navigation';
import { BookForm } from '@/app/(main)/book/edit/[id]/BookForm';

export default function EditBookPage() {
  const { id } = useParams();

  return (
    <div className="bg-base-100 container mx-auto max-w-[1024px] p-6">
      <BookForm id={Number(id)} />
    </div>
  );
}
