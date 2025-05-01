import React, { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ChatListItem } from '@/types/chat';

interface ChatListProps {
  selectedRoomId: number | null;
  setSelectedRoomId: Dispatch<SetStateAction<number | null>>;
  chatList: ChatListItem[] | undefined;
}

const ChatList = ({
  selectedRoomId,
  setSelectedRoomId,
  chatList,
}: ChatListProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {(isDesktop || (!isDesktop && selectedRoomId === null)) && (
        <div
          className={twMerge(
            'border-base-300 flex w-full flex-col md:w-1/3 lg:w-1/4',
            isDesktop && 'bg-base-200 border-r'
          )}
        >
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
                  src={
                    room.book.bookImage[0]?.imageUrl ??
                    '/images/default-book.png'
                  }
                  alt="책 이미지"
                  className="h-12 w-12 rounded"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-semibold">
                    {room.opponent.name}
                  </div>
                  <div className="text-base-content/70 truncate text-sm">
                    {room.lastMessage ?? '메세지가 없습니다'}
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
      )}
    </>
  );
};

export default ChatList;
