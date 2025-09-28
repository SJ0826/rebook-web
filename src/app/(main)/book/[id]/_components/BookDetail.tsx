'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BookOpenIcon,
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftIcon,
  ClockIcon,
  HeartIcon as HeartIconOutline,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import ImageCarousel from '@/components/ui/ImageCarousel';
import CustomRadioGroup from '@/components/ui/CustomRadioGroup';
import { Button } from '@/components/ui';
import OrderModal from '@/app/(main)/book/[id]/_components/OrderModal';
import BookStatusBadge from '@/app/(main)/book/[id]/_components/BookStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useModalStack } from '@/hooks/useModalStack';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { useMyProfileQuery } from '@/hooks/mutations/useAuthMutation';
import {
  deleteBookAPI,
  getBookDetailAPI,
  updateBookSaleStatusAPI,
} from '@/lib/api/books';
import { triggerToast, useToast } from '@/lib/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';
import { createOrderAPI } from '@/lib/api/orders';
import { getTimeAgo } from '@/lib/utils/time';
import { createFavoriteAPI, deleteFavoriteAPI } from '@/lib/api/favorite';
import { BookSaleStatus } from '@/types/books';

export default function BookDetail() {
  const { id } = useParams();

  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { push, clear } = useModalStack();
  const { showToast } = useToast();
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useMyProfileQuery();

  const isMobile = useBreakpoint('md');
  const queryClient = useQueryClient();

  const {
    data: book,
    isLoading,
    isError,
    refetch: refetchBook,
  } = useQuery({
    queryKey: ['bookDetail', Number(id), isLoggedIn],
    queryFn: async () => await getBookDetailAPI(Number(id)),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  /** 책 삭제 뮤테이션 */
  const { mutate: deleteBook, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteBookAPI(Number(id)),
    onSuccess: () => {
      triggerToast('책이 성공적으로 삭제되었습니다.', 'success');
      queryClient.invalidateQueries({ queryKey: ['searchBooks'] });
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
      clear();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      showToast(
        error.response?.data?.message ?? '거래 생성에 실패했습니다',
        'error'
      );

      if (error.code === '401') {
        router.push(ROUTES.LOGIN);
      }
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
    if (!isLoggedIn) {
      router.push(ROUTES.LOGIN);
      showToast('로그인이 필요한 서비스입니다.');
      return;
    }

    if (book.isOrderRequested) {
      router.push('/chat?bookId=' + book.id);
      return;
    }

    push({
      key: '',
      modal: (
        <OrderModal
          onClickCancel={clear}
          onClickConfirm={() => {
            createOrderMutate(book.id);
          }}
        />
      ),
    });
  };

  /** 받은 제안 클릭 시 */
  const handleIncomingOrder = () => {
    if (book.orderCount === 0) {
      showToast('아직 진행중인 거래가 없어요', 'info');
      return;
    }
    router.push(`${ROUTES.BOOK}/${book.id}/chats`);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col gap-6 rounded-lg bg-white p-6 lg:flex-row lg:items-start lg:items-stretch lg:gap-8">
        {/* 이미지 섹션 */}
        <div className="lg:w-[370px] lg:flex-shrink-0">
          <ImageCarousel images={book?.bookImages || []} title={book.title} />
        </div>

        {/* 책 정보 섹션 */}
        <div className="flex flex-1 flex-col lg:justify-between">
          {/* 상단 정보 그룹 */}
          <div className="space-y-4 py-4">
            {/* 제목과 상태 */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-normal text-gray-900 lg:text-3xl">
                {book.title}
              </h1>
              <BookStatusBadge status={book.status} />
            </div>

            {/* 가격 */}
            <div>
              <span className="text-3xl font-semibold text-gray-900 lg:text-4xl">
                {book?.price?.toLocaleString()}원
              </span>
            </div>

            <div
              className={'h-[1px] w-full border-t border-gray-200 lg:mt-6'}
            ></div>

            {/* 기본 정보 (좋아요, 채팅, 시간) */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <HeartIconOutline
                    width={16}
                    height={16}
                    className="text-red-500"
                  />
                  <span>좋아요 {book.favoriteCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChatBubbleOvalLeftIcon width={16} height={16} />
                  <span>채팅 {book.orderCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon width={16} height={16} className="text-gray-500" />
                  <span>{getTimeAgo(book.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 액션 그룹 */}
          <div className="space-y-4">
            {isOwner ? (
              // 판매 상태 변경 (판매자만)
              <CustomRadioGroup
                label="판매 상태"
                value={book.saleStatus}
                onChange={(value) => updateSaleStatus(value as BookSaleStatus)}
                options={saleStatusOptions}
              />
            ) : (
              // 판매자 정보
              <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-lg font-semibold text-blue-600">
                    {book.seller?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {book.seller?.name}
                  </p>
                  <p className="text-sm text-gray-500">판매자</p>
                </div>
              </div>
            )}

            <div className="lg:block">
              {!isOwner ? (
                <div className="flex flex-wrap gap-3">
                  <Button
                    size={isMobile ? 'md' : 'lg'}
                    variant={'line-sub'}
                    onClick={handleFavorite}
                    className={`flex min-w-[180px] flex-1 items-center gap-2 ${
                      book.isFavorite
                        ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-50'
                        : 'border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <HeartIconOutline className="h-5 w-5" />
                    {'좋아요'}
                  </Button>
                  <Button
                    size={isMobile ? 'md' : 'lg'}
                    onClick={handleOrderButton}
                    className="flex min-w-[180px] flex-1 items-center justify-center gap-2"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    {book.isOrderRequested
                      ? '진행중인 거래 보기'
                      : '거래 제안하기'}
                  </Button>
                </div>
              ) : (
                <div
                  className={twMerge(
                    'flex',
                    isMobile
                      ? 'flex-col gap-2 border-t border-dashed border-gray-200 pt-4'
                      : 'gap-3'
                  )}
                >
                  <div className={'flex flex-1'}>
                    <Button
                      size={isMobile ? 'md' : 'lg'}
                      onClick={handleIncomingOrder}
                      className="flex w-full items-center justify-center gap-2"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>리북톡</span>
                      <span className="rounded-full bg-white/20 px-2 py-1 text-sm">
                        {book.orderCount || 0}
                      </span>
                    </Button>
                  </div>
                  <div
                    className={twMerge(isMobile ? 'flex gap-2' : 'flex gap-2')}
                  >
                    <Button
                      size={isMobile ? 'md' : 'lg'}
                      color="gray"
                      variant={'line-sub'}
                      onClick={handleEdit}
                      className={twMerge(
                        'flex items-center gap-2',
                        isMobile && 'flex-1'
                      )}
                    >
                      <PencilIcon className="h-5 w-5" />
                      수정
                    </Button>
                    <Button
                      size={isMobile ? 'md' : 'lg'}
                      variant={'line-sub'}
                      color="red"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={twMerge(
                        'flex items-center gap-2',
                        isMobile && 'flex-1'
                      )}
                    >
                      <TrashIcon className="h-5 w-5" />
                      삭제
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 상품 설명 섹션 */}
      <div className="rounded-lg bg-white p-6">
        <div
          className={
            'mb-4 flex items-center gap-2 border-b border-gray-200 px-2 pb-3'
          }
        >
          <BookOpenIcon width={24} height={24} />
          <h2 className="text-xl font-semibold text-gray-900">상품 정보</h2>
        </div>

        <div className="space-y-3 px-4">
          <div className="flex items-center gap-2">
            <div className={'flex items-center gap-1 text-gray-600'}>
              <span className="">▪︎ 작가:</span>
            </div>
            <span className="font-medium text-gray-900">{book.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={'flex items-center gap-1 text-gray-600'}>
              <span className="">▪︎ 출판사:</span>
            </div>
            <span className="font-medium text-gray-900">{book.publisher}</span>
          </div>
          <p className="pt-2 leading-relaxed whitespace-pre-line text-gray-700">
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
}

const saleStatusOptions = [
  {
    value: 'FOR_SALE',
    label: '판매중',
    description: '구매자가 찾을 수 있어요',
  },
  {
    value: 'SOLD',
    label: '판매 완료',
    description: '판매가 완료되어 더 이상 노출되지 않아요',
  },
];
