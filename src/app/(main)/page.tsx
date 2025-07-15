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
    searchQuery: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    statusFilter: undefined,
    sortOption: BookSearchSort.NEWEST,
    currentPage: 1,
  };

  await queryClient.prefetchQuery({
    queryKey: [
      'searchBooks',
      defaultParams.searchQuery,
      defaultParams.sortOption,
      defaultParams.statusFilter,
      defaultParams.minPrice,
      defaultParams.maxPrice,
      defaultParams.currentPage,
    ],
    queryFn: () =>
      getSearchBooks({
        searchQuery: defaultParams.searchQuery,
        sort: defaultParams.sortOption,
        status: defaultParams.statusFilter,
        minPrice: defaultParams.minPrice,
        maxPrice: defaultParams.maxPrice,
        page: defaultParams.currentPage,
        limit: 8,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={'px-2 md:px-10'}>
        <RebookMain />
      </div>
    </HydrationBoundary>
  );
}
