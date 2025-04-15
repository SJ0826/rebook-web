// 채팅방 목록
export interface ChatListOpponent {
  userId: number;
  name: string;
  imageUrl: string | null;
}

export interface ChatListItem {
  chatRoomId: number;
  lastMessage: string;
  lastMessageTime: string; // ISO 문자열로 응답되므로 Date 타입이 아님
  opponent: ChatListOpponent;
  bookImage: string;
  unreadCount: number;
}
