'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const chatRooms = [
    {
      id: 1,
      bookTitle: '자바의 정석',
      lastMessage: '가격 네고 되나요?',
      unreadCount: 2,
      opponentName: '홍길동',
      bookImageUrl: 'https://placehold.co/60x60',
    },
    {
      id: 2,
      bookTitle: 'Clean Code',
      lastMessage: '감사합니다. 내일 뵈어요!',
      unreadCount: 0,
      opponentName: '김철수',
      bookImageUrl: 'https://placehold.co/60x60',
    },
  ];

  return (
    <div className="bg-base-100 text-base-content flex h-full">
      {/* 채팅 목록 (웹 좌측) */}
      <div className="border-base-300 bg-base-200 hidden flex-col border-r md:flex md:w-1/3 lg:w-1/4">
        <div className="border-base-300 border-b p-4 text-xl font-bold">
          채팅 목록
        </div>
        <ul className="divide-base-300 divide-y overflow-y-auto">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={`hover:bg-base-300 flex cursor-pointer items-center gap-4 px-4 py-3 ${
                selectedRoomId === room.id ? 'bg-base-300 font-bold' : ''
              }`}
            >
              <img
                src={room.bookImageUrl}
                alt="책 이미지"
                className="h-12 w-12 rounded"
              />
              <div className="flex-1">
                <div className="text-base-content font-semibold">
                  {room.bookTitle}
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
