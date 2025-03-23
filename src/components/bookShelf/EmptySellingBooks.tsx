import React from 'react';
import Image from 'next/image';
import emptyImage from '@public/images/empty.png';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';

const EmptySellingBooks = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-6">
      <div className="relative w-40 h-40">
        <Image
          src={emptyImage}
          alt="ReBook Logo"
          fill
          className="object-contain"
        />
      </div>
      <h2 className="text-2xl font-bold text-neutral-800">
        판매 중인 책이 없어요
      </h2>
      <p className="text-gray-500">
        등록된 책이 없어요. 지금 바로 첫 책을 등록해보세요!
      </p>
      <button
        onClick={() => router.push(ROUTES.BOOK_REGISTER)}
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow hover:bg-yellow-300 transition"
      >
        책 등록하기
      </button>
    </div>
  );
};

export default EmptySellingBooks;
