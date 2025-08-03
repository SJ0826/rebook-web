'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getChatList, updateLastReadTime } from '@/lib/api/chat';
import ChatList from '@/app/(main)/chat/_components/ChatList';
import ChatDetail from '@/app/(main)/chat/_components/ChatDetail';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useToast } from '@/lib/contexts/ToastContext';

const IncomingOrderChats = () => {
  const params = useParams();
  const bookId = Number(params.id);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { showToast } = useToast();

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // 📌 채팅 목록 조회
  const {
    data: chatList,
    isError: isChatListError,
    refetch: refetchChatList,
  } = useQuery({
    queryKey: ['chatList', bookId],
    queryFn: async () => {
      return await getChatList(bookId ? Number(bookId) : undefined);
    },
  });
  if (isChatListError) {
    showToast('채팅 목록 조회 중 에러가 발생했습니다', 'error');
  }

  // 📌 마지막으로 읽은 날짜 업데이트
  const { mutate: updateLastReadTimeMutate } = useMutation({
    mutationFn: updateLastReadTime,
    onError: (error) => {
      console.error(error, ': 마지막으로 읽은 날짜 업데이트 실패');
    },
  });

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

      {/* ✅ 채팅 상세  */}
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
            setSelectedRoomId={setSelectedRoomId}
            book={
              chatList?.find((chat) => chat.chatRoomId === selectedRoomId)?.book
            }
          />
        </div>
      )}
    </div>
  );
};

export default IncomingOrderChats;
