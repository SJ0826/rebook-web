import React from 'react';
import VerifyEmailNotification from '@/components/signup/VerifyEmailNotification';
import CommonPageLayout from '@/components/layout/CommonPageLayout';

const page = () => {
  return (
    <CommonPageLayout>
      <VerifyEmailNotification />
    </CommonPageLayout>
  );
};

export default page;
