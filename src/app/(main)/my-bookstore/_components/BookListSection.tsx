'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Book, BookSaleStatus } from '@/types/books';
import { Field, Label, Switch } from '@headlessui/react';
import BookCard from '@/app/(main)/(home)/_components/BookCard';
import { Button } from '@/components/ui';

interface BookListSectionProps {
  fetchBooks: (params: {
    saleStatus?: BookSaleStatus;
    page: number;
    limit: number;
  }) => Promise<{
    books: Book[];
    totalCount: number;
    totalPages: number;
  }>;
  queryKeyBase: string;
  // EmptyState: React.FC<{ isShow: boolean }>;
}

const PAGE_SIZE = 8;

const BookListSection = ({
  fetchBooks,
  queryKeyBase,
  // EmptyState,
}: BookListSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyOnSale, setOnlyOnSale] = useState(true);

  const { data: BookListData } = useQuery({
    queryKey: [queryKeyBase, onlyOnSale, currentPage],
    queryFn: async () => {
      return await fetchBooks({
        saleStatus: onlyOnSale ? BookSaleStatus.FOR_SALE : undefined,
        page: currentPage,
        limit: PAGE_SIZE,
      });
    },
  });

  return (
    <div className="flex flex-col px-4 md:p-0">
      {/* ✅ 필터 */}
      <div className={'my-6 flex justify-end'}>
        <Field className={'flex items-center gap-2'}>
          <Label className={'text-gray-700'}>판매 중인 책만 보기</Label>
          <Switch
            checked={onlyOnSale}
            onChange={setOnlyOnSale}
            className="group data-checked:bg-primary-600 inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
        </Field>
      </div>

      {/* ✅ 책 리스트 */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
        {BookListData?.books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {/*<EmptyState isShow={data?.totalCount === 0} />*/}

      {/* ✅ 페이지네이션 */}
      <div className="mt-10 flex justify-center gap-3">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          color={'secondary'}
          variant={'line-sub'}
        >
          «
        </Button>
        {Array.from({ length: BookListData?.totalPages ?? 0 }, (_, i) => (
          <Button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            variant={currentPage === i + 1 ? 'fill' : 'line-none'}
            color={'secondary'}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < (BookListData?.totalPages ?? 0) ? prev + 1 : prev
            )
          }
          disabled={currentPage === BookListData?.totalPages}
          color={'secondary'}
          variant={'line-sub'}
        >
          »
        </Button>
      </div>
    </div>
  );
};

export default BookListSection;
