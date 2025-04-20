import React, { useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { useChat } from '@/hooks/useChat';

const ChatDetail = ({ selectedRoomId }: { selectedRoomId: number | null }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useChat(selectedRoomId, setMessages);
  return (
    <>
      <div className="bg-base-100 flex-1 overflow-y-auto p-4">
        {selectedRoomId ? (
          <div>
            <div className="mb-4 text-xl font-bold">
              채팅방 #{selectedRoomId}
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble bg-base-200 text-base-content">
                안녕하세요!
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble bg-warning text-warning-content">
                네 안녕하세요~
              </div>
            </div>
            {messages?.map((msg) => {
              return (
                <div key={msg.id}>
                  <p>{msg.content}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-base-content/50 flex h-full items-center justify-center">
            채팅방을 선택해주세요.
          </div>
        )}
      </div>

      {selectedRoomId && (
        <div className="border-base-300 bg-base-200 flex items-center gap-2 border-t p-4">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="input input-bordered bg-base-100 flex-1"
          />
          <button className="btn btn-warning text-white">전송</button>
        </div>
      )}
    </>
  );
};

export default ChatDetail;
