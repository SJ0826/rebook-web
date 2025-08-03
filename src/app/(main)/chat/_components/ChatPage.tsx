'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import ChatDetail from '@/app/(main)/chat/_components/ChatDetail';
import { getChatList, updateLastReadTime } from '@/lib/api/chat';
import { useToast } from '@/lib/contexts/ToastContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ChatList from '@/app/(main)/chat/_components/ChatList';
import { useSearchParams } from 'next/navigation';

export default function ChatPage() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const bookId = Number(searchParams.get('bookId'));
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // 📌 채팅 목록 조회
  const {
    data: chatList,
    isError: isChatListError,
    refetch: refetchChatList,
  } = useQuery({
    queryKey: ['chatList', bookId],
    queryFn: async () => {
      const response = await getChatList(bookId ? Number(bookId) : undefined);
      if (bookId) {
        // 구매자가 책 상세페이지에서 바로 들어온 경우
        const targetChatRoomId = response.find(
          (chat) => chat.book.id === bookId
        )?.chatRoomId;

        if (targetChatRoomId) {
          setSelectedRoomId(targetChatRoomId);
        } else {
          showToast('채팅을 찾을 수 없습니다', 'error');
        }
      }

      return response;
    },
  });

  // 📌 마지막으로 읽은 날짜 업데이트
  const { mutate: updateLastReadTimeMutate } = useMutation({
    mutationFn: async (selectedRoomId: number) => {
      const response = await updateLastReadTime(selectedRoomId);

      if (response.lastReadAt) {
        refetchChatList();
        return;
      }
    },
    onError: (error) => {
      console.error(error, ': 마지막으로 읽은 날짜 업데이트 실패');
    },
  });

  useEffect(() => {
    if (isChatListError) {
      showToast('메세지 목록을 읽어올 수 없습니다', 'error');
    }
  }, [isChatListError, showToast]);

  useEffect(() => {
    if (!selectedRoomId) return;
    updateLastReadTimeMutate(Number(selectedRoomId));
    refetchChatList();
  }, [refetchChatList, selectedRoomId, updateLastReadTimeMutate]);

  return (
    <div className="flex h-full w-full md:mx-0 md:h-[560px] md:py-3">
      {/* ✅ 채팅 목록 */}
      <ChatList
        selectedRoomId={selectedRoomId}
        setSelectedRoomId={setSelectedRoomId}
        chatList={chatList}
      />

      {/* ✅ 채팅 상세 */}
      {(isDesktop || (!isDesktop && selectedRoomId !== null)) && (
        <div className="flex flex-1 flex-col">
          <ChatDetail
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            book={
              chatList?.find((chat) => chat.chatRoomId === selectedRoomId)?.book
            }
          />
        </div>
      )}
    </div>
  );
}
