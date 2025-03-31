import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import emptyImage from '@public/images/empty.png';
import { ROUTES } from '@/lib/constants';
import BookListSection from '@/components/bookShelf/BookListSection';
import { getBuyingBooks } from '@/lib/api/my';

const BuyingBooks = ({ isActive }: { isActive: boolean }) => {
  return (
    <BookListSection
      isActive={isActive}
      fetchBooks={getBuyingBooks}
      queryKeyBase={'buyingBooks'}
      EmptyState={EmptyBuyingBooks}
    />
  );
};

export default BuyingBooks;

const EmptyBuyingBooks = ({ isShow }: { isShow: boolean }) => {
  const router = useRouter();
  if (!isShow) return null;
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-6">
      <div className="relative w-40 h-40">
        <Image
          src={emptyImage}
          alt="ReBook Logo"
          fill
          sizes={'160px'}
          priority
          className="object-contain"
        />
      </div>
      <h2 className="text-2xl font-bold text-neutral-800">
        구매한 책이 없어요
      </h2>
      <p className="text-gray-500">
        마음에 드는 책을 찾아보고 구매를 진행해보세요.
      </p>
      <button
        onClick={() => router.push(ROUTES.HOME)}
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow hover:bg-yellow-300 transition"
      >
        책 보러가기
      </button>
    </div>
  );
};
