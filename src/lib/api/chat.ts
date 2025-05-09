import { privateAxiosClient } from '@/lib/api/axios.client';
import { ApiResponse } from '@/types/commons';
import { ChatListItem, ChatMessage } from '@/types/chat';

const CHAT = '/chat';

// 채팅 목록 조회
export const getChatList = async (bookId?: number) => {
  const response = await privateAxiosClient.get<ApiResponse<ChatListItem[]>>(
    CHAT,
    { params: bookId !== undefined ? { bookId } : {} }
  );
  return response.data.data;
};

// 특정 채팅방의 기존 메세지 조회
export const getChatMessages = async (
  chatRoomId: number,
  take: number = 20,
  before?: string
) => {
  const url = `${CHAT}/${chatRoomId}/messages`;
  const response = await privateAxiosClient.get<ApiResponse<ChatMessage[]>>(
    url,
    {
      params: {
        take,
        ...(before ? { before } : {}),
      },
    }
  );

  return response.data.data;
};

// 채팅방 마지막으로 읽은 날짜 업데이트 (채팅방 입장시 사용)
export const updateLastReadTime = async (chatRoomId: number) => {
  const url = `${CHAT}/${chatRoomId}/read`;
  const response = await privateAxiosClient.patch<
    ApiResponse<{
      id: number;
      userId: number;
      chatRoomId: number;
      lastReadAt: string;
    }>
  >(url);
  return response.data.data;
};
