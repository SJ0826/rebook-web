'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import ChatDetail from '@/components/chat/ChatDetail';
import { getChatList, updateLastReadTime } from '@/lib/api/chat';
import { useToast } from '@/lib/contexts/ToastContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ChatList from '@/components/chat/ChatList';
import { useSearchParams } from 'next/navigation';
import { useMyProfileQuery } from '@/hooks/useAuthMutation';

export default function ChatPage() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const bookId = Number(searchParams.get('bookId'));
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const myProfile = useMyProfileQuery();

  const isDesktop = useMediaQuery('(min-width: 768px)');

  // 채팅 목록 조회
  const {
    data: chatList,
    isError: isChatListError,
    refetch: refetchChatList,
  } = useQuery({
    queryKey: ['chatList', bookId],
    queryFn: async () => {
      const response = await getChatList(bookId ? Number(bookId) : undefined);
      if (bookId) {
        const targetChatRoomId = response.find(
          (chat) => chat.book.id === bookId
        )?.chatRoomId;

        if (targetChatRoomId) {
          const isSeller = response[0].book.sellerId === myProfile.data?.id;
          setSelectedRoomId(isSeller ? null : targetChatRoomId);
        } else {
          showToast('채팅을 찾을 수 없습니다', 'error');
        }
      }
      return response;
    },
  });

  // 마지막으로 읽은 날짜 업데이트
  const { mutate: updateLastReadTimeMutate } = useMutation({
    mutationFn: updateLastReadTime,
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
    <div className="bg-base-100 text-base-content -mx-4 -mb-19 flex max-h-screen flex-1 md:mx-0">
      {/* ✅ 목록 조건 */}
      <ChatList
        selectedRoomId={selectedRoomId}
        setSelectedRoomId={setSelectedRoomId}
        chatList={chatList}
      />

      {/* ✅ 상세 조건 */}
      {(isDesktop || (!isDesktop && selectedRoomId !== null)) && (
        <div className="flex flex-1 flex-col">
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
          <ChatDetail
            selectedRoomId={selectedRoomId}
            book={
              chatList?.find((chat) => chat.chatRoomId === selectedRoomId)?.book
            }
          />
        </div>
      )}
    </div>
  );
}
