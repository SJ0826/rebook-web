import React from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import CommonPageLayout from '@/components/layout/CommonPageLayout';
import { getBookDetailAPI } from '@/lib/api/books';
import BookDetail from '@/app/(main)/book/[id]/_components/BookDetail';

export default async function bookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const queryClient = new QueryClient();
  const { id } = await params;
  const bookId = Number(id);

  await queryClient.prefetchQuery({
    queryKey: ['bookDetail', bookId],
    queryFn: () => getBookDetailAPI(bookId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommonPageLayout>
        <BookDetail />
      </CommonPageLayout>
    </HydrationBoundary>
  );
}
