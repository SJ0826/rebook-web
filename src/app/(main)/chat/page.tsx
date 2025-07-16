import React, { Suspense } from 'react';
import ChatPage from '@/components/chat/ChatPage';

const Page = () => {
  return (
    <Suspense fallback={<p>...loading</p>}>
      <ChatPage />
    </Suspense>
  );
};

export default Page;
