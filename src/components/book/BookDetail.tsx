'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BookStatusBadge from '@/components/book/BookStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfileQuery } from '@/hooks/useAuthMutation';
import { deleteBookAPI, getBookDetailAPI } from '@/lib/api/books';
import { triggerToast, useToast } from '@/lib/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';
import { createFavoriteAPI, deleteFavoriteAPI } from '@/lib/api/favorite';

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useMyProfileQuery();
  const queryClient = useQueryClient();

  const {
    data: book,
    isLoading,
    isError,
    refetch: refetchBook,
  } = useQuery({
    queryKey: ['bookDetail', id],
    queryFn: async () => await getBookDetailAPI(Number(id)),
    enabled: !!id,
  });

  /** 책 삭제 뮤테이션 */
  const { mutate: deleteBook, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteBookAPI(Number(id)),
    onSuccess: () => {
      triggerToast('책이 성공적으로 삭제되었습니다.', 'success');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      router.push('/');
    },
    onError: () => {
      triggerToast('책 삭제에 실패했습니다. 다시 시도해주세요.', 'error');
    },
  });

  /** 책장에 추가 (좋아요) 뮤테이션 */
  const { mutate: createFavorite } = useMutation({
    mutationFn: (bookId: bigint) => createFavoriteAPI(bookId),
    onSuccess: async () => {
      await refetchBook();
      triggerToast('관심 책장에 추가했어요', 'success');
    },
  });

  /** 책장에서 제거 (좋아요 제거) 뮤테이션 */
  const { mutate: deleteFavorite } = useMutation({
    mutationFn: (bookId: bigint) => deleteFavoriteAPI(bookId),
    onSuccess: async () => {
      await refetchBook();
      triggerToast('관심 책장에서 제거했어요', 'success');
    },
  });

  if (isLoading || isMyProfileLoading)
    return <p className="text-center">📖 책 정보를 불러오는 중...</p>;
  if (isError || !book)
    return (
      <p className="text-center text-red-500">책 정보를 찾을 수 없습니다.</p>
    );

  const isOwner = myProfile && book.seller?.id === myProfile.id;

  /** 삭제 버튼 클릭 시 */
  const handleDelete = () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      deleteBook();
    }
  };

  /** 수정 버튼 클릭 시 */
  const handleEdit = () => {
    router.push(`${ROUTES.BOOK_EDIT}/${id}`);
  };

  /** 책장에 추가 / 책장에서 제거 클릭 시 */
  const handleFavorite = () => {
    if (!isLoggedIn) {
      router.push(ROUTES.LOGIN);
      showToast('로그인이 필요한 서비스입니다.');
      return;
    }

    if (book.isFavorite) {
      deleteFavorite(book.id);
      return;
    }

    createFavorite(book.id);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6">
        {/* 이미지 섹션 */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          {book?.bookImages?.length ? (
            <div className="carousel w-full rounded-lg">
              {book.bookImages.map(
                (
                  bookImage: { uuid: string; imageUrl: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    id={`slide${index}`}
                    className="carousel-item relative w-full"
                  >
                    <Image
                      width={400}
                      height={400}
                      src={bookImage.imageUrl}
                      alt={`book-image-${index}`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2">
                      <a
                        href={`#slide${(index - 1 + book.bookImages.length) % book.bookImages.length}`}
                        className="btn btn-circle btn-sm bg-white/70"
                      >
                        ❮
                      </a>
                      <a
                        href={`#slide${(index + 1) % book.bookImages.length}`}
                        className="btn btn-circle btn-sm bg-white/70"
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg" />
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
                <button className="btn btn-primary w-full md:w-1/2">
                  거래 제안하기
                </button>
                <div
                  className={'tooltip  w-full md:w-1/2'}
                  data-tip={'관심 책장은 나의 서재에서 확인할 수 있어요'}
                >
                  <button
                    className="btn btn-outline btn-primary w-full"
                    onClick={handleFavorite}
                  >
                    {book.isFavorite
                      ? '관심 책장에서 제거'
                      : '관심 책장에 추가'}
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    ❤️ {book.favoriteCount ?? 0}명이 관심 있어요
                  </p>
                </div>
              </div>
            ) : (
              <div className={'w-full flex flex-col gap-3 md:flex-row'}>
                <button className="btn btn-primary flex-1 flex">
                  <span>받은 제안</span>
                  <div
                    className={
                      'badge badge-sm bg-neutral border-neutral text-base-100'
                    }
                  >
                    {book.requestCount ?? 0}
                  </div>
                </button>
                <button
                  className="btn btn-outline btn-primary flex-1"
                  onClick={handleEdit}
                >
                  수정하기
                </button>
                <button
                  className="btn btn-outline btn-error flex-1"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '삭제 중...' : '삭제하기'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
