import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useChat } from '@/hooks/useChat';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/contexts/ToastContext';
import { formatKoreanTime } from '@/lib/utils/time';

import { convertBookSaleStatus } from '@/lib/utils/convert';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ROUTES } from '@/lib/constants';
import { BookSummary } from '@/app/(main)/chat/_types';
import { useMyProfileQuery } from '@/hooks/mutations/useAuthMutation';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { ArrowUturnLeftIcon } from '@heroicons/react/16/solid';

const ChatDetail = ({
  selectedRoomId,
  setSelectedRoomId,
  book,
}: {
  selectedRoomId: number | null;
  setSelectedRoomId: Dispatch<SetStateAction<number | null>>;
  book?: BookSummary;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const messagesLengthRef = useRef<number>(0);
  const { showToast } = useToast();
  const { messages, sendMessage, loadMoreMessages, hasMore } =
    useChat(selectedRoomId);
  const { data: myProfile } = useMyProfileQuery();
  const queryClient = useQueryClient();

  const [currentMessage, setCurrentMessage] = useState('');
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMyBubble = (senderId: number) => myProfile?.id === senderId;

  // 📌 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior,
        block: 'center',
      });
    }
  }, []);

  // 📌 메세지 전송 핸들러
  const handleSubmitMessage = async () => {
    const message = currentMessage.trim();
    if (!message || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setShouldScrollToBottom(true);
      await sendMessage(message);
      setCurrentMessage('');
    } finally {
      setTimeout(() => {
        // 중복 전송 방지 디바운싱
        setIsSubmitting(false);
      }, 300);
    }
  };

  // 📌 메세지 전송 키보드 핸들러
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const message = currentMessage.trim();
      if (!message || isSubmitting) return;

      try {
        setIsSubmitting(true);
        setShouldScrollToBottom(true);
        await sendMessage(message);
        setCurrentMessage('');
      } catch {
        showToast('메시지 전송 실패', 'error');
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 300);
      }
    }
  };

  // 📌 메시지가 변경되었을 때 스크롤 처리
  useEffect(() => {
    if (!messages) return;

    // 채팅 목록 업데이트 (안읽은 메세지 초기화)
    queryClient.invalidateQueries({ queryKey: ['chatList'] });

    // 새 메시지가 추가된 경우에만 스크롤 처리
    if (messages.length > messagesLengthRef.current && shouldScrollToBottom) {
      // 메시지가 렌더링 된 후에 스크롤 처리를 위해 setTimeout 사용
      const timer = setTimeout(() => {
        scrollToBottom(isFirstLoad ? 'auto' : 'smooth');
        setIsFirstLoad(false);
      }, 100);

      return () => clearTimeout(timer);
    }

    // 현재 메시지 수를 저장
    messagesLengthRef.current = messages.length;
  }, [messages, shouldScrollToBottom, scrollToBottom, isFirstLoad]);

  // 📌 채팅방이 변경되었을 때 초기화
  useEffect(() => {
    if (selectedRoomId !== null) {
      setIsFirstLoad(true);
      setShouldScrollToBottom(true);
      messagesLengthRef.current = 0;
    }
  }, [selectedRoomId]);

  // 📌 스크롤 감지 후 과거 메세지 호출
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = async () => {
      if (el.scrollTop === 0) {
        if (!hasMore) {
          showToast('마지막 메세지입니다', 'info');
          return;
        }

        const previousScrollHeight = el.scrollHeight;

        await loadMoreMessages();

        requestAnimationFrame(() => {
          const newScrollHeight = el.scrollHeight;
          const heightDiff = newScrollHeight - previousScrollHeight;
          el.scrollTop = heightDiff;
        });
      }

      // 사용자가 스크롤을 올렸을 때는 자동 스크롤 비활성화
      const isScrolledNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShouldScrollToBottom(isScrolledNearBottom);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMoreMessages, showToast]);

  if (!book) {
    return (
      <div className="text-base-content/50 flex h-full items-center justify-center">
        채팅방을 선택해주세요.
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col pb-20 md:pb-0">
      {!isDesktop && (
        <div className="flex items-center border-b border-gray-300 p-4">
          <Button
            onClick={() => setSelectedRoomId(null)}
            variant={'line-sub'}
            color={'secondary'}
            className={'flex w-fit items-center gap-2'}
          >
            <ArrowUturnLeftIcon width={16} height={16} />
            <span>채팅 목록으로</span>
          </Button>
        </div>
      )}
      {/* 책 요약 정보 */}
      <section className="sticky top-0 z-10 bg-white px-4 py-2">
        <Link href={`${ROUTES.BOOK}/${book.id}`}>
          <div className="flex cursor-pointer items-center gap-4 bg-white p-2 shadow-md">
            <Image
              src={
                book?.bookImage?.[0]?.imageUrl ??
                '/images/default-book-detail.png'
              }
              alt="책 썸네일"
              width={50}
              height={50}
              className="rounded-md object-cover"
            />
            <div>
              <div className="text-lg font-semibold">{book?.title}</div>
              <div className="text-sm">
                ₩ {book?.price?.toLocaleString()} ·{' '}
                {convertBookSaleStatus(book?.saleStatus)}
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 채팅 메시지 리스트 */}
      <section
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white px-4 py-2"
      >
        <div ref={topSentinelRef} />
        {messages?.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          return (
            <div
              key={msg.id}
              ref={isLastMessage ? lastMessageRef : undefined}
              className="px-4 py-2"
            >
              {isMyBubble(msg.senderId) ? (
                <div className="flex w-full justify-end">
                  <div className="max-w-xs text-right">
                    <div className="bg-primary-400 inline-block rounded-lg px-4 py-2 text-white shadow-md">
                      {msg.content}
                    </div>
                    <div className="text-secondary-500 mt-1 text-xs">
                      {formatKoreanTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full justify-start">
                  <div className="max-w-xs text-left">
                    <div className="bg-secondary-200 text-secondary-800 inline-block rounded-lg px-4 py-2 shadow-md">
                      {msg.content}
                    </div>
                    <div className="text-secondary-500 mt-1 text-xs">
                      {formatKoreanTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 입력창 */}
      <section className="flex h-[73px] items-center gap-2 border-t border-gray-300 bg-white p-4">
        <Input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className={'flex-1'}
        />
        <Button
          onClick={handleSubmitMessage}
          disabled={isSubmitting || !currentMessage.trim()}
        >
          전송
        </Button>
      </section>
    </div>
  );
};

export default ChatDetail;
