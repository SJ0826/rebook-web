'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChatList } from '@/lib/api/chat';
import { useToast } from '@/lib/contexts/ToastContext';

export default function ChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const { showToast } = useToast();
  const { data: chatList, isError: isChatListError } = useQuery({
    queryKey: ['chatList'],
    queryFn: async () => {
      return await getChatList();
    },
  });
  if (isChatListError) {
    showToast('메세지 목록을 읽어올 수 없습니다', 'error');
  }

  return (
    <div className="bg-base-100 text-base-content flex h-full">
      {/* 채팅 목록 (웹 좌측) */}
      <div className="border-base-300 bg-base-200 hidden flex-col border-r md:flex md:w-1/3 lg:w-1/4">
        <div className="border-base-300 border-b p-4 text-xl font-bold">
          채팅 목록
        </div>
        <ul className="divide-base-300 divide-y overflow-y-auto">
          {chatList?.map((room) => (
            <li
              key={room.chatRoomId}
              onClick={() => setSelectedRoomId(room.chatRoomId)}
              className={`hover:bg-base-300 flex cursor-pointer items-center gap-4 px-4 py-3 ${
                selectedRoomId === room.chatRoomId
                  ? 'bg-base-300 font-bold'
                  : ''
              }`}
            >
              <img
                src={room.bookImage}
                alt="책 이미지"
                className="h-12 w-12 rounded"
              />
              <div className="flex-1">
                <div className="text-base-content font-semibold">
                  {room.opponent.name}
                </div>
                <div className="text-base-content/70 text-sm">
                  {room.lastMessage}
                </div>
              </div>
              {room.unreadCount > 0 && (
                <div className="badge badge-warning badge-sm text-white">
                  {room.unreadCount}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 채팅 상세 */}
      <div className="flex flex-1 flex-col">
        {/* 모바일: 목록으로 돌아가기 버튼 */}
        <div className="border-base-300 bg-base-200 border-b p-4 md:hidden">
          <button
            onClick={() => setSelectedRoomId(null)}
            className="btn btn-sm btn-outline"
          >
            채팅 목록으로
          </button>
        </div>

        {/* 채팅 내역 */}
        <div className="bg-base-100 flex-1 overflow-y-auto p-4">
          {selectedRoomId ? (
            <div>
              <div className="mb-4 text-xl font-bold">
                채팅방 #{selectedRoomId}
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble bg-base-200 text-base-content">
                  안녕하세요!
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble bg-warning text-warning-content">
                  네 안녕하세요~
                </div>
              </div>
            </div>
          ) : (
            <div className="text-base-content/50 flex h-full items-center justify-center">
              채팅방을 선택해주세요.
            </div>
          )}
        </div>

        {/* 입력창 */}
        {selectedRoomId && (
          <div className="border-base-300 bg-base-200 flex items-center gap-2 border-t p-4">
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              className="input input-bordered bg-base-100 flex-1"
            />
            <button className="btn btn-warning text-white">전송</button>
          </div>
        )}
      </div>
    </div>
  );
}
