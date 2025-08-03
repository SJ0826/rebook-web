import React, { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ChatListItem } from '@/app/(main)/chat/_types';
import Image from 'next/image';

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
            'flex w-full flex-col border-gray-300 md:w-1/3 lg:w-1/4',
            isDesktop && 'border-r bg-gray-50'
          )}
        >
          <div className="sticky top-0 border-b border-gray-300 p-4 text-xl font-bold md:bg-gray-50">
            채팅 목록
          </div>
          <ul className="divide-y divide-gray-300">
            {chatList?.map((room) => (
              <li
                key={room.chatRoomId}
                onClick={() => setSelectedRoomId(room.chatRoomId)}
                className={`flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-gray-300 ${
                  selectedRoomId === room.chatRoomId ? 'bg-white font-bold' : ''
                }`}
              >
                <Image
                  src={
                    room.book.bookImage[0]?.imageUrl ??
                    '/images/default-book-detail.png'
                  }
                  width={48}
                  height={48}
                  alt="책 이미지"
                  className="h-12 w-12 rounded"
                />
                <div className="flex-1">
                  <div className="truncate font-semibold">
                    {room.opponent.name}
                  </div>
                  <div className="text-gray-content/70 truncate text-sm">
                    {room.lastMessage ?? '메세지가 없습니다'}
                  </div>
                </div>
                {room.unreadCount > 0 && (
                  <div className="bg-secondary-700 flex h-6 w-6 items-center justify-center rounded-full p-1 text-sm text-white">
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
