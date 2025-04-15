import { privateAxiosClient } from '@/lib/api/axios.client';
import { ApiResponse } from '@/types/commons';
import { ChatListItem } from '@/types/chat';

const CHAT = '/chat';

export const getChatList = async () => {
  const response = await privateAxiosClient.get<ApiResponse<ChatListItem[]>>(
    `${CHAT}`
  );
  return response.data.data;
};
