import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/chat';
import { getChatMessages } from '@/lib/api/chat';
import { useAuth } from '@/hooks/useAuth';
import { ProfileResponse } from '@/lib/api/my';

export function useChat(chatRoomId: number | null, sender?: ProfileResponse) {
  const { accessToken } = useAuth();
  const socketRef = useRef<Socket>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // -------------------------------
  // 메시지 전송
  // -------------------------------
  const sendMessage = (content: string) => {
    if (!socketRef.current || !chatRoomId) return;
    socketRef.current.emit('message', { chatRoomId, content });

    if (!sender) return;
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
        setMessages(res.data);
      } catch (error) {
        console.log('메세지 조회 실패', error);
      }
    };

    // 2. 소켓 연결 및 방 입장
    const connectSocket = () => {
      if (socketRef.current) return; // ✅ 이미 연결된 경우 중복 방지

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

  return {
    messages,
    sendMessage,
  };
}
