import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useChat } from '@/hooks/useChat';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/lib/api/my';
import { useToast } from '@/lib/contexts/ToastContext';
import { formatKoreanTime } from '@/lib/utils/time';
import { BookSummary } from '@/types/chat';
import { convertBookSaleStatus } from '@/lib/utils/convert';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';

const ChatDetail = ({
  selectedRoomId,
  setSelectedRoomId,
  book,
}: {
  selectedRoomId: number | null;
  setSelectedRoomId: Dispatch<SetStateAction<number | null>>;
  book?: BookSummary;
}) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { showToast } = useToast();
  const { messages, sendMessage, loadMoreMessages, hasMore } =
    useChat(selectedRoomId);
  const [currentMessage, setCurrentMessage] = useState('');
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 내 정보 조회
  const { data: myProfile } = useQuery({
    queryKey: ['myData'],
    queryFn: getMyProfile,
  });
  const isMyBubble = (senderId: number) => myProfile?.id === senderId;

  // 메세지 전송 핸들러
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
        setCurrentMessage('');
      }, 300);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const message = currentMessage.trim();
      if (!message) return;

      try {
        setShouldScrollToBottom(true);
        await sendMessage(message);
      } catch {
        showToast('메시지 전송 실패', 'error');
      } finally {
        setCurrentMessage('');
      }
    }
  };

  useEffect(() => {
    if (!shouldScrollToBottom || !messages?.length || !lastMessageRef.current)
      return;

    // 두 프레임 뒤에 실행 (최신 챗 버블 포커징 목적)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lastMessageRef.current!.scrollIntoView({
          behavior: isFirstLoad ? 'auto' : 'smooth',
          block: 'end',
        });
        setShouldScrollToBottom(false);
        setIsFirstLoad(false);
      });
    });
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    if (selectedRoomId !== null) {
      setIsFirstLoad(true);
      setShouldScrollToBottom(true);
    }
  }, [selectedRoomId]);

  // 스크롤 감지 후 과거 메세지 호출
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
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMoreMessages]);

  if (!book) {
    return (
      <div className="text-base-content/50 flex h-full items-center justify-center">
        채팅방을 선택해주세요.
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      {!isDesktop && (
        <div className="border-base-300 bg-base-200 flex items-center border-b p-4">
          <button
            onClick={() => setSelectedRoomId(null)}
            className="btn btn-sm btn-outline"
          >
            채팅 목록으로
          </button>
        </div>
      )}
      {/* 책 요약 정보 */}
      <section className="sticky top-0 z-10 bg-white px-4 py-6 pb-2">
        <div
          className="border-base-300 flex items-center gap-4 border-b bg-white p-4 shadow-md"
          onClick={() => router.push(`${ROUTES.BOOK}/${book.id}`)}
        >
          <Image
            src={book?.bookImage?.[0]?.imageUrl ?? '/images/default-book.png'}
            alt="책 썸네일"
            width={64}
            height={80}
            className="h-20 w-16 rounded-md object-cover"
          />
          <div>
            <div className="text-lg font-semibold">{book?.title}</div>
            <div className="text-base-content/70 text-sm">
              ₩ {book?.price?.toLocaleString()} ·{' '}
              {convertBookSaleStatus(book?.saleStatus)}
            </div>
          </div>
        </div>
      </section>

      {/* 채팅 메시지 리스트 */}
      <section
        ref={scrollRef}
        className="bg-base-100 min-h-0 flex-1 overflow-y-auto px-4 py-2"
      >
        <div ref={topSentinelRef} />
        {messages?.map((msg) => {
          return (
            <div key={msg.id}>
              {isMyBubble(msg.senderId) ? (
                <div className="chat chat-end">
                  <div className="chat-bubble bg-warning text-warning-content">
                    {msg.content}
                  </div>
                  <div className="chat-footer">
                    {formatKoreanTime(msg.createdAt)}
                  </div>
                </div>
              ) : (
                <div className="chat chat-start">
                  <div className="chat-bubble bg-base-200 text-base-content">
                    {msg.content}
                  </div>
                  <div className="chat-footer">
                    {formatKoreanTime(msg.createdAt)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={lastMessageRef} />
      </section>

      {/* 입력창 */}
      <section className="border-base-300 bg-base-200 flex h-[73px] items-center gap-2 border-t p-4">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className="input input-bordered bg-base-100 flex-1"
        />
        <button
          className="btn btn-warning text-white"
          onClick={handleSubmitMessage}
        >
          전송
        </button>
      </section>
    </div>
  );
};

export default ChatDetail;
