import React, { Suspense } from 'react';
import VerifyEmailNotification from '@/components/signup/VerifyEmailNotification';
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
