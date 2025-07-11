import React from 'react';
import RebookMain from '@/components/home/RebookMain';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { BookSearchSort } from '@/types/books';
import { getSearchBooks } from '@/lib/api/books';

export default async function HomePage() {
  const queryClient = new QueryClient();

  const defaultParams = {
    searchTerm: '',
    priceFilter: '',
    statusFilter: '',
    sortOption: BookSearchSort.NEWEST,
    currentPage: 1,
    limit: 8,
  };

  await queryClient.prefetchQuery({
    queryKey: ['searchBooks', ...Object.values(defaultParams)],
    queryFn: () => getSearchBooks(defaultParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={'px-2 md:px-10'}>
        <RebookMain />
      </div>
    </HydrationBoundary>
  );
}
