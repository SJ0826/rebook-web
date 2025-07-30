import React from 'react';
import { twMerge } from 'tailwind-merge';
import { BookshelfType } from '@/app/(main)/my-bookstore/_type';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useQuery } from '@tanstack/react-query';
import { getBookStoreSummary } from '@/lib/api/my';

interface BookShelfControllerProps {
  activeTab: BookshelfType;
  setActiveTab: React.Dispatch<React.SetStateAction<BookshelfType>>;
}

interface BookStoreSummary {
  sellingBooksCount: number;
  buyingBooksCount: number;
  favoriteBooksCount: number;
}

const bookShelfList: {
  label: string;
  key: BookshelfType;
  countKey: keyof BookStoreSummary;
}[] = [
  { label: '판매 책장', key: 'sellingBooks', countKey: 'sellingBooksCount' },
  { label: '구매 책장', key: 'buyingBooks', countKey: 'buyingBooksCount' },
  {
    label: '좋아요 책장',
    key: 'favoriteBooks',
    countKey: 'favoriteBooksCount',
  },
];
const BookShelfController = ({
  activeTab,
  setActiveTab,
}: BookShelfControllerProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { data: bookStoreSummary } = useQuery({
    queryKey: ['bookStoreSummary'],
    queryFn: getBookStoreSummary,
    select: (data) => data,
  });

  if (!bookStoreSummary) {
    return <div>loading...</div>;
  }

  return (
    <>
      <div className={'my-4 h-[1px] w-full border-t border-gray-200'} />

      {isDesktop ? (
        <ul className={'flex flex-col gap-4'}>
          {bookShelfList.map((bookShelf) => (
            <li
              key={bookShelf.key}
              onClick={() => setActiveTab(bookShelf.key)}
              className={twMerge(
                'flex items-center p-2 pl-6 text-lg font-semibold transition hover:cursor-pointer'
              )}
            >
              <span
                className={twMerge(
                  activeTab === bookShelf.key
                    ? 'text-black underline underline-offset-4'
                    : 'text-gray-400'
                )}
              >
                {bookShelf.label}
              </span>

              <span
                className={twMerge(
                  'ml-1',
                  activeTab === bookShelf.key ? 'text-black' : 'text-gray-400'
                )}
              >
                ({bookStoreSummary[bookShelf.countKey]})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          className={
            'sticky top-0 flex w-full justify-evenly border-b border-gray-200'
          }
        >
          {bookShelfList.map((bookShelf) => (
            <li
              key={bookShelf.key}
              onClick={() => setActiveTab(bookShelf.key)}
              className={twMerge(
                'relative h-full min-w-[90px] pb-3 text-center transition duration-200 hover:cursor-pointer',
                activeTab === bookShelf.key
                  ? 'border-b-[1.5px] border-b-black text-black'
                  : 'text-gray-400'
              )}
            >
              <span className={''}>{bookShelf.label}</span>
            </li>
          ))}
        </ul>
      )}

      {isDesktop && (
        <div className={'my-4 h-[1px] w-full border-t border-gray-200'} />
      )}
    </>
  );
};

export default BookShelfController;
