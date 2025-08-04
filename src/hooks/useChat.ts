import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getChatMessages } from '@/lib/api/chat';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/app/(main)/chat/_types';

export function useChat(chatRoomId: number | null) {
  const PAGE_SIZE = 20;
  const { accessToken } = useAuth();
  const socketRef = useRef<Socket>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // -------------------------------
  // 메시지 전송
  // -------------------------------
  const sendMessage = async (content: string) => {
    console.log('socketRef.current', socketRef.current);
    console.log('chatRoomId', chatRoomId);
    if (!socketRef.current || !chatRoomId) return;
    socketRef.current.emit('message', { chatRoomId, content });
  };

  // -------------------------------
  // 메시지 수신 및 초기 로딩
  // -------------------------------
  useEffect(() => {
    if (!chatRoomId) return;
    if (socketRef.current) return;
    // 1. 기존 메세지 조회
    const loadMessages = async () => {
      try {
        const res = await getChatMessages(chatRoomId);
        setMessages(res.reverse());
      } catch (error) {
        console.log('메세지 조회 실패', error);
      }
    };

    // 2. 소켓 연결 및 방 입장
    const connectSocket = () => {
      if (socketRef.current) return;

      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        withCredentials: true,
        auth: { token: accessToken },
        transports: ['polling', 'websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('✅ 소켓 연결 성공!');
        console.log('🔌 연결 상태:', socketRef.current?.connected);
        socketRef.current?.emit('joinRoom', { chatRoomId });
      });

      socketRef.current.on('loadMessages', (msgs) => {
        console.log('📨 초기 메시지 로드:', msgs);
        setMessages(msgs);
      });

      socketRef.current.on('newMessage', (msg) => {
        console.log('📩 새 메시지 수신:', msg);
        setMessages((prev) => [...prev, msg]);
      });
    };

    loadMessages();
    connectSocket();

    // cleanup
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [chatRoomId]);

  // -----------------------------------
  // 과거 메세지 조회 (페이지네이션)
  // -----------------------------------
  const loadMoreMessages = async () => {
    if (!chatRoomId) return;
    const oldest = messages[0];
    const before = oldest?.createdAt;

    const newMessages = await getChatMessages(chatRoomId, PAGE_SIZE, before);

    setMessages((prev) => [...newMessages.reverse(), ...prev]);
    setHasMore(newMessages.length === PAGE_SIZE);
  };

  return {
    messages,
    sendMessage,
    loadMoreMessages,
    hasMore,
  };
}
