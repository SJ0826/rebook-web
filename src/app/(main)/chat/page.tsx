import React, { Suspense } from 'react';
import ChatPage from '@/app/(main)/chat/_components/ChatPage';
import CommonPageLayout from '@/components/layout/CommonPageLayout';

const Page = () => {
  return (
    <Suspense fallback={<p>...loading</p>}>
      <CommonPageLayout>
        <ChatPage />
      </CommonPageLayout>
    </Suspense>
  );
};

export default Page;
