import React from 'react';
import IncomingOrderChats from '@/app/(main)/book/[id]/_components/IncomingOrderChats';
import CommonPageLayout from '@/components/layout/CommonPageLayout';

const Page = () => {
  return (
    <CommonPageLayout>
      <IncomingOrderChats />
    </CommonPageLayout>
  );
};

export default Page;
