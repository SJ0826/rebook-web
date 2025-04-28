'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ChatDetail from '@/components/chat/ChatDetail';
import { getChatList } from '@/lib/api/chat';
import { useToast } from '@/lib/contexts/ToastContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ChatList from '@/components/chat/ChatList'; // 추가

export default function ChatPage() {
  const { showToast } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { data: chatList, isError: isChatListError } = useQuery({
    queryKey: ['chatList'],
    queryFn: async () => await getChatList(),
  });

  useEffect(() => {
    if (isChatListError) {
      showToast('메세지 목록을 읽어올 수 없습니다', 'error');
    }
  }, [isChatListError, showToast]);

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
