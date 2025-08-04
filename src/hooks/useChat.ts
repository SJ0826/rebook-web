import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getChatMessages } from '@/lib/api/chat';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/app/(main)/chat/_types';

export function useChat(chatRoomId: number | null) {
  const PAGE_SIZE = 20;
  const { accessToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null);

  // 연결 상태 확인 및 재연결 함수
  const ensureConnection = useCallback(() => {
    if (!socketRef.current || !socketRef.current.connected) {
      console.log('🔄 소켓 재연결 시도...');
      connectSocket();
      return false;
    }
    return true;
  }, [chatRoomId, accessToken]);

  // 소켓 연결 함수
  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('🔌 이미 연결된 소켓 존재');
      return;
    }

    // 기존 소켓 정리
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    console.log('🔗 새로운 소켓 연결 시도...');
    console.log('🌐 서버 URL:', process.env.NEXT_PUBLIC_SOCKET_URL);
    console.log('🔑 토큰 존재:', !!accessToken);

    if (accessToken) {
      console.log('🎫 토큰 앞 10자리:', accessToken.substring(0, 10) + '...');

      // JWT 토큰 파싱해서 만료시간 확인
      try {
        const tokenParts = accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log(
            '⏰ 토큰 만료시간:',
            new Date(payload.exp * 1000).toISOString()
          );
          console.log('🕐 현재 시간:', new Date().toISOString());
          console.log('✅ 토큰 유효:', payload.exp * 1000 > Date.now());
        }
      } catch (e) {
        console.error('❌ 토큰 파싱 실패:', e);
      }
    }

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      withCredentials: true,
      auth: { token: accessToken },
      transports: ['polling', 'websocket'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true, // 강제로 새 연결 생성
    });

    // 연결 성공
    socketRef.current.on('connect', () => {
      console.log('✅ 소켓 연결 성공!');
      console.log('🆔 소켓 ID:', socketRef.current?.id);
      setIsConnected(true);

      if (chatRoomId) {
        console.log('🏠 방 입장 시도:', chatRoomId);
        socketRef.current?.emit('joinRoom', { chatRoomId });
      }

      // 재연결 타이머 클리어
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    });

    // 연결 해제
    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ 소켓 연결 해제:', reason);
      setIsConnected(false);

      // 서버에서 강제로 끊은 경우가 아니라면 재연결 시도
      if (reason === 'io server disconnect') {
        console.log('🚨 서버에서 강제 해제 (인증 문제일 가능성)');
      } else {
        console.log('🔄 3초 후 재연결 시도...');
        reconnectTimeoutRef.current = setTimeout(() => {
          if (chatRoomId && accessToken) {
            connectSocket();
          }
        }, 3000);
      }
    });

    // 연결 에러
    socketRef.current.on('connect_error', (error) => {
      console.log('💥 연결 에러:', error.message);
      setIsConnected(false);

      // 5초 후 재연결 시도
      reconnectTimeoutRef.current = setTimeout(() => {
        if (chatRoomId && accessToken) {
          connectSocket();
        }
      }, 5000);
    });

    // 재연결 시도
    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log('🔄 재연결 성공:', attemptNumber);
    });

    // 메시지 이벤트 리스너
    socketRef.current.on('loadMessages', (msgs) => {
      console.log('📨 초기 메시지 로드:', msgs);
      setMessages(msgs);
    });

    socketRef.current.on('newMessage', (msg) => {
      console.log('📩 새 메시지 수신:', msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, [chatRoomId, accessToken]);

  // 메시지 전송
  const sendMessage = useCallback(
    async (content: string) => {
      console.log('📤 메시지 전송 시도:', content);
      console.log('🔌 현재 연결 상태:', socketRef.current?.connected);
      console.log('🏠 채팅방 ID:', chatRoomId);

      if (!chatRoomId) {
        console.error('❌ 채팅방 ID 없음');
        return;
      }

      // 연결 상태 확인 및 재연결
      if (!ensureConnection()) {
        console.log('⏳ 연결 대기 중... 3초 후 재시도');
        setTimeout(() => sendMessage(content), 3000);
        return;
      }

      try {
        socketRef.current?.emit('message', { chatRoomId, content });
        console.log('✅ 메시지 전송 완료');
      } catch (error) {
        console.error('❌ 메시지 전송 실패:', error);
      }
    },
    [chatRoomId, ensureConnection]
  );

  // 초기 설정
  useEffect(() => {
    if (!chatRoomId || !accessToken) return;

    // 기존 메시지 로드
    const loadMessages = async () => {
      try {
        const res = await getChatMessages(chatRoomId);
        setMessages(res.reverse());
      } catch (error) {
        console.error('❌ 메시지 조회 실패:', error);
      }
    };

    loadMessages();
    connectSocket();

    return () => {
      console.log('🧹 소켓 정리...');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [chatRoomId, accessToken, connectSocket]);

  // 과거 메시지 조회
  const loadMoreMessages = async () => {
    if (!chatRoomId) return;
    const oldest = messages[0];
    const before = oldest?.createdAt;

    try {
      const newMessages = await getChatMessages(chatRoomId, PAGE_SIZE, before);
      setMessages((prev) => [...newMessages.reverse(), ...prev]);
      setHasMore(newMessages.length === PAGE_SIZE);
    } catch (error) {
      console.error('❌ 과거 메시지 로드 실패:', error);
    }
  };

  return {
    messages,
    sendMessage,
    loadMoreMessages,
    hasMore,
    isConnected, // 연결 상태 추가
  };
}
