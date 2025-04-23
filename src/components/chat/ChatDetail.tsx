import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/lib/api/my';
import { useToast } from '@/lib/contexts/ToastContext';
import { formatKoreanTime } from '@/lib/utils/time';

const ChatDetail = ({ selectedRoomId }: { selectedRoomId: number | null }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!shouldScrollToBottom) return;

    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({
            behavior: isFirstLoad ? 'auto' : 'smooth',
          });
          setShouldScrollToBottom(false);
          if (isFirstLoad) setIsFirstLoad(false);
        }
      });
    }, 0); // DOM 업데이트 이후에 실행되도록

    return () => clearTimeout(timeout);
  }, [messages, shouldScrollToBottom]);

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

  return (
    <>
      <div className="bg-base-100 flex-1 overflow-y-auto p-4" ref={scrollRef}>
        {selectedRoomId ? (
          <div>
            <div className="mb-4 text-xl font-bold">
              채팅방 #{selectedRoomId}
            </div>
            <div ref={topSentinelRef}></div>

            {messages?.map((msg, index) => {
              const isLast = index === messages.length - 1;
              return (
                <div
                  key={msg.id + msg.createdAt}
                  ref={isLast ? lastMessageRef : undefined}
                >
                  {isMyBubble(msg.senderId) ? (
                    <div className="chat chat-end">
                      <div className="chat-bubble bg-warning text-warning-content">
                        {msg.content}
                      </div>
                      <div className={'chat-footer'}>
                        {formatKoreanTime(msg.createdAt)}
                      </div>
                    </div>
                  ) : (
                    <div className="chat chat-start">
                      <div className="chat-bubble bg-base-200 text-base-content">
                        {msg.content}
                      </div>
                      <div className={'chat-footer'}>
                        {formatKoreanTime(msg.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-base-content/50 flex h-full items-center justify-center">
            채팅방을 선택해주세요.
          </div>
        )}
      </div>

      {selectedRoomId && (
        <div className="border-base-300 bg-base-200 flex items-center gap-2 border-t p-4">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="input input-bordered bg-base-100 flex-1"
            value={currentMessage}
            onChange={(value) => setCurrentMessage(value.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmitMessage();
              }
            }}
          />
          <button
            className="btn btn-warning text-white"
            onClick={handleSubmitMessage}
          >
            전송
          </button>
        </div>
      )}
    </>
  );
};

export default ChatDetail;
