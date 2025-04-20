import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/chat';
import { getChatMessages } from '@/lib/api/chat';
import { useAuth } from '@/hooks/useAuth';

export function useChat(
  chatRoomId: number | null,
  onMessagesLoaded: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const { accessToken } = useAuth();
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    if (!chatRoomId) return;
    // 1. 기존 메세지 조회
    const loadMessages = async () => {
      try {
        const res = await getChatMessages(chatRoomId);
        onMessagesLoaded(res.data);
      } catch (error) {
        console.log('메세지 조회 실패', error);
      }
    };

    // 2. 소켓 연결 및 방 입장
    const connectSocket = () => {
      console.log('🔄 소켓 연결 시도:', { chatRoomId, token: !!accessToken });

      socketRef.current = io('http://localhost:4000', {
        withCredentials: true,
        auth: { token: accessToken },
        transports: ['polling', 'websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('✅ 소켓 연결 성공!');
        socketRef.current?.emit('joinRoom', { chatRoomId });
      });

      socketRef.current.on('loadMessages', (msgs) => {
        console.log('📨 초기 메시지 로드:', msgs);
        onMessagesLoaded(msgs);
      });

      socketRef.current.on('newMessage', (msg) => {
        console.log('📩 새 메시지 수신:', msg);
        onMessagesLoaded((prev) => [...prev, msg]);
      });
    };

    loadMessages();
    connectSocket();

    // cleanup
    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatRoomId, onMessagesLoaded]);
}
