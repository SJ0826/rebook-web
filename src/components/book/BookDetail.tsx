'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import BookStatusBadge from '@/components/book/BookStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfileQuery } from '@/hooks/useAuthMutation';
import { getBookDetailAPI } from '@/lib/api/books';

export default function BookDetail() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useMyProfileQuery();

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['bookDetail', id],
    queryFn: async () => (await getBookDetailAPI(Number(id))).data,
    enabled: !!id,
  });

  if (isLoading || isMyProfileLoading)
    return <p className="text-center">📖 책 정보를 불러오는 중...</p>;
  if (isError || !book)
    return (
      <p className="text-center text-red-500">책 정보를 찾을 수 없습니다.</p>
    );

  const isOwner = myProfile && book.seller?.id === myProfile.id;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6">
        {/* 이미지 섹션 */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          {book?.bookImages?.length ? (
            <Image
              width={200}
              height={200}
              src={book.bookImages[0]}
              alt={book.title}
              className="w-full h-auto object-cover rounded-lg"
            />
          ) : (
            <div className={'w-full h-full bg-gray-200'} />
          )}
        </div>

        {/* 책 정보 섹션 */}
        <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6 flex flex-col justify-between">
          <div>
            <div className={'flex gap-3 flex-wrap items-center'}>
              <h1 className="text-2xl font-bold">{book.title}</h1>
              <BookStatusBadge status={book?.status || 'NEW'} />
            </div>

            <p className="text-gray-600 mt-1">저자: {book.author}</p>

            <p className="text-gray-600">출판사: {book.publisher}</p>
            <p className="text-gray-800 font-semibold mt-2">
              ₩{book?.price?.toLocaleString()} 원
            </p>

            <div className="mt-4">
              <p className="whitespace-pre-line text-gray-700">
                {book.description}
              </p>
            </div>

            {/* 상태 및 판매자 정보 */}
            <div className="mt-4">
              <p className="mt-2 text-gray-500">판매자: {book.seller?.name}</p>
            </div>
          </div>

          {/* 버튼 섹션 */}
          <div className="mt-6 flex gap-4">
            {!isOwner || !isLoggedIn ? (
              <div className={'w-full flex flex-col gap-4 md:flex-row'}>
                <button className="btn btn-primary w-full  md:w-1/2">
                  거래 제안하기
                </button>
                <button className="btn btn-outline btn-primary w-full md:w-1/2 ">
                  찜하기
                </button>
              </div>
            ) : (
              <div className={'w-full flex flex-col gap-4 md:flex-row'}>
                <button className="btn  btn-primary w-full md:w-1/2 ">
                  받은 제안 보기
                </button>
                <button className="btn btn-outline btn-primary w-full md:w-1/2 ">
                  수정하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
