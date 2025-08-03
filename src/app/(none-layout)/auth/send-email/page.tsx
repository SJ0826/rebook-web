import React, { Suspense } from 'react';
import VerifyEmailNotification from '@/app/(none-layout)/signup/_components/VerifyEmailNotification';
import CommonPageLayout from '@/components/layout/CommonPageLayout';

const page = () => {
  return (
    <Suspense fallback={<p>...loading</p>}>
      <CommonPageLayout>
        <VerifyEmailNotification />
      </CommonPageLayout>
    </Suspense>
  );
};

export default page;
