import React from 'react';
import BookDetail from '@/components/book/BookDetail';
import CommonPageLayout from '@/components/layout/CommonPageLayout';
import { getBookDetailAPI } from '@/lib/api/books';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function bookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();
  const id = Number(params.id);

  await queryClient.prefetchQuery({
    queryKey: ['bookDetail', id],
    queryFn: () => getBookDetailAPI(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommonPageLayout>
        <BookDetail />
      </CommonPageLayout>
    </HydrationBoundary>
  );
}
