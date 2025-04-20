import { privateAxiosClient } from '@/lib/api/axios.client';
import { ApiResponse } from '@/types/commons';
import { ChatListItem } from '@/types/chat';

const CHAT = '/chat';

// 채팅 목록 조회
export const getChatList = async () => {
  const response = await privateAxiosClient.get<ApiResponse<ChatListItem[]>>(
    `${CHAT}`
  );
  return response.data.data;
};

// 특정 채팅방의 기존 메세지 조회
export const getChatMessages = async (chatRoomId: number) => {
  const url = `${CHAT}/${chatRoomId}/messages`;
  const response = await privateAxiosClient.get(url);

  return response.data.data;
};
