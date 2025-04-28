'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BookStatusBadge from '@/components/book/BookStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfileQuery } from '@/hooks/useAuthMutation';
import {
  deleteBookAPI,
  getBookDetailAPI,
  updateBookSaleStatusAPI,
} from '@/lib/api/books';
import { triggerToast, useToast } from '@/lib/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';
import { createFavoriteAPI, deleteFavoriteAPI } from '@/lib/api/favorite';
import { BookSaleStatus } from '@/types/books';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/16/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { createOrderAPI } from '@/lib/api/orders';
import { AxiosError } from 'axios';

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useMyProfileQuery();
  const queryClient = useQueryClient();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

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

  /** 책 판매 상태 변경 뮤테이션 */
  const { mutate: updateSaleStatus } = useMutation({
    mutationFn: (saleStatus: BookSaleStatus) =>
      updateBookSaleStatusAPI(Number(id), saleStatus),
    onSuccess: async () => {
      await refetchBook();
      triggerToast('판매 상태가 변경되었습니다.', 'success');
    },
    onError: () => {
      triggerToast('판매 상태 변경에 실패했습니다.', 'error');
    },
  });

  /** 책장에 추가 (좋아요) 뮤테이션 */
  const { mutate: createFavorite } = useMutation({
    mutationFn: (bookId: number) => createFavoriteAPI(bookId),
    onSuccess: async () => {
      await refetchBook();
      triggerToast('관심 책장에 추가했어요', 'success');
    },
  });

  /** 책장에서 제거 (좋아요 제거) 뮤테이션 */
  const { mutate: deleteFavorite } = useMutation({
    mutationFn: (bookId: number) => deleteFavoriteAPI(bookId),
    onSuccess: async () => {
      await refetchBook();
      triggerToast('관심 책장에서 제거했어요', 'success');
    },
  });

  /** 거래 제안하기 뮤테이션 */
  const { mutate: createOrderMutate } = useMutation({
    mutationFn: createOrderAPI,
    onSuccess: async (res) => {
      router.push(`${ROUTES.CHAT}?id=${res.id}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      showToast(
        error.response?.data?.message ?? '거래 생성에 실패했습니다',
        'error'
      );
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
      <div className="flex flex-col rounded-lg bg-white p-6 shadow-lg md:flex-row">
        {/* 이미지 섹션 */}
        <div className="flex w-full items-center justify-center md:w-1/3">
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
                      className="h-auto w-full rounded-lg object-cover"
                    />
                    <div className="absolute top-1/2 right-2 left-2 flex -translate-y-1/2 transform justify-between">
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
            <div className="h-64 w-full rounded-lg bg-gray-200" />
          )}
        </div>

        {/* 책 정보 섹션 */}
        <div className="mt-4 flex w-full flex-col justify-between md:mt-0 md:ml-6 md:w-2/3">
          <div>
            <div className={'flex flex-wrap items-center gap-3'}>
              <h1 className="text-2xl font-bold">{book.title}</h1>
              <BookStatusBadge status={book?.status || 'NEW'} />
              <div className="flex items-center gap-1 rounded-full border border-gray-300 px-2 py-[2px] text-sm text-gray-700">
                {book.isFavorite ? (
                  <HeartIconSolid className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIconOutline className="h-4 w-4 text-red-500" />
                )}

                {book?.favoriteCount}
              </div>
            </div>

            <p className="mt-1 text-gray-600">저자: {book.author}</p>
            <p className="text-gray-600">출판사: {book.publisher}</p>
            <p className="mt-2 font-semibold text-gray-800">
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
            {/* 판매 상태 드롭다운 */}

            <div className="form-control mt-4 w-full max-w-xs">
              <select
                className="select select-bordered"
                value={book.saleStatus}
                onChange={(e) =>
                  updateSaleStatus(e.target.value as BookSaleStatus)
                }
                disabled={!isOwner}
              >
                <option value="FOR_SALE">판매중</option>
                <option value="SOLD">판매 완료</option>
              </select>
            </div>
          </div>

          {/* 버튼 섹션 */}
          <div className="mt-6 flex gap-4">
            {!isOwner || !isLoggedIn ? (
              <div className={'flex w-full flex-col gap-4 md:flex-row'}>
                <button
                  className="btn btn-primary w-full md:w-1/2"
                  onClick={() => setIsOrderModalOpen(true)}
                >
                  거래 제안하기
                </button>
                <div
                  className={'tooltip w-full md:w-1/2'}
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
                </div>
              </div>
            ) : (
              <div className={'flex w-full flex-col gap-3 md:flex-row'}>
                <button
                  className="btn btn-primary flex flex-1"
                  onClick={() =>
                    router.push(`${ROUTES.CHAT}?bookId=${book.id}`)
                  }
                >
                  <span>받은 제안</span>
                  <div
                    className={
                      'badge badge-sm bg-neutral border-neutral text-base-100'
                    }
                  >
                    {book.orderCount ?? 0}
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
      {isOrderModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">거래를 시작할까요?</h3>
            <p className="py-4">
              이 책에 대해 판매자에게 거래를 제안하고 채팅방을 생성할게요.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setIsOrderModalOpen(false)}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  createOrderMutate(book.id);
                  setIsOrderModalOpen(false);
                }}
              >
                네, 시작할게요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
