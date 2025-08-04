import React from 'react';
import CommonPageLayout from '@/components/layout/CommonPageLayout';
import BookDetail from '@/app/(main)/book/[id]/_components/BookDetail';

export default async function bookDetailPage() {
  return (
    <CommonPageLayout>
      <BookDetail />
    </CommonPageLayout>
  );
}
