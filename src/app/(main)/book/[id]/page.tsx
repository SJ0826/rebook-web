import React from 'react';
import BookDetail from '@/components/book/BookDetail';
import CommonPageLayout from '@/components/layout/CommonPageLayout';

const bookDetailPage = () => {
  return (
    <CommonPageLayout>
      <BookDetail />
    </CommonPageLayout>
  );
};

export default bookDetailPage;
