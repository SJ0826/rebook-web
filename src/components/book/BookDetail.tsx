'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BookStatusBadge from '@/components/book/BookStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfileQuery } from '@/hooks/mutations/useAuthMutation';
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
import {
  ChatBubbleLeftIcon,
  HeartIcon as HeartIconOutline,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createOrderAPI } from '@/lib/api/orders';
import { AxiosError } from 'axios';
import OrderModal from '@/components/book/OrderModal';
import ImageCarousel from '@/components/ui/ImageCarousel';

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useMyProfileQuery();
  const queryClient = useQueryClient();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  /** 거래 요청 하기 / 진행중인 거래 보기 클릭 시 */
  const handleOrderButton = () => {
    if (book.isOrderRequested) {
      router.push('/chat?bookId=' + book.id);
      return;
    }

    setShowOrderModal(true);
  };

  /** 받은 제안 클릭 시 */
  const handleIncomingOrder = () => {
    if (book.orderCount === 0) {
      showToast('아직 제안 받은 거래가 없어요', 'info');
      return;
    }
    router.push(`${ROUTES.BOOK}/${book.id}/chats`);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col gap-2 rounded-lg bg-white p-6 lg:flex-row">
        {/* 이미지 섹션 */}
        <div className="lg:w-[400px]">
          <ImageCarousel images={book?.bookImages || []} title={book.title} />
        </div>

        {/* 책 정보 섹션 */}
        <div className="p-6 lg:flex-1 lg:px-8">
          {/* 상태 및 좋아요 */}
          <div className="mb-4 flex items-center gap-3">
            <BookStatusBadge status={book?.status || 'NEW'} />
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <HeartIconOutline className="h-4 w-4" />
              <span>{book?.favoriteCount || 0}</span>
            </div>
            {book.saleStatus === 'SOLD' && (
              <div className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                판매완료
              </div>
            )}
          </div>

          {/* 제목 및 기본 정보 */}
          <h1 className="mb-2 text-2xl font-semibold text-gray-900 lg:text-3xl">
            {book.title}
          </h1>

          {/* 가격 */}
          <div className="mb-6">
            <span className="text-3xl font-semibold text-gray-900">
              {book?.price?.toLocaleString()}원
            </span>
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold text-gray-900">상품 설명</h3>
            <p className="text-gray-600">
              저자: <span className="font-medium">{book.author}</span>
            </p>
            <p className="leading-relaxed whitespace-pre-line text-gray-700">
              {book.description}
            </p>
          </div>

          {/* 판매자 정보 */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <span className="font-semibold text-blue-600">
                  {book.seller?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{book.seller?.name}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8</span>
                  <span>·</span>
                  <span>거래 24회</span>
                </div>
              </div>
            </div>
          </div>

          {/* 판매 상태 드롭다운 (판매자만) */}
          {isOwner && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                판매 상태
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={book.saleStatus}
                onChange={(e) =>
                  updateSaleStatus(e.target.value as BookSaleStatus)
                }
              >
                <option value="FOR_SALE">판매중</option>
                <option value="SOLD">판매 완료</option>
              </select>
            </div>
          )}

          {/* 하단 고정 버튼 (모바일) */}
          <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-4 lg:hidden">
            <div className="flex gap-3">
              <button
                onClick={handleFavorite}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                  book.isFavorite
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                {book.isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIconOutline className="h-6 w-6 text-gray-500" />
                )}
              </button>

              {!isOwner ? (
                <button
                  onClick={handleOrderButton}
                  className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {book.isOrderRequested
                    ? '진행 중인 거래 보기'
                    : '거래 제안하기'}
                </button>
              ) : (
                <div className="flex flex-1 gap-2">
                  <button
                    onClick={handleIncomingOrder}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>제안</span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                      {book.orderCount || 0}
                    </span>
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-300 transition-colors hover:bg-gray-50"
                  >
                    <PencilIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-300 transition-colors hover:bg-red-50"
                  >
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 데스크톱 버튼 */}
          <div className="mx-auto hidden max-w-6xl px-4 pb-8 lg:block">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              {!isOwner ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleFavorite}
                    className={`rounded-xl border-2 px-6 py-3 font-medium transition-colors ${
                      book.isFavorite
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-300 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {book.isFavorite
                      ? '관심 책장에서 제거'
                      : '관심 책장에 추가'}
                  </button>
                  <button
                    onClick={handleOrderButton}
                    className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    {book.isOrderRequested
                      ? '진행 중인 거래 보기'
                      : '거래 제안하기'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleIncomingOrder}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>받은 거래 제안</span>
                    <span className="rounded-full bg-white/20 px-2 py-1 text-sm">
                      {book.orderCount || 0}
                    </span>
                  </button>
                  <button
                    onClick={handleEdit}
                    className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded-xl border border-red-300 px-6 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    {isDeleting ? '삭제 중...' : '삭제하기'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showOrderModal && (
        <OrderModal
          onClickCancel={() => setShowOrderModal(false)}
          onClickConfirm={() => {
            createOrderMutate(book.id);
            setShowOrderModal(false);
          }}
        />
      )}
    </div>
  );
}
