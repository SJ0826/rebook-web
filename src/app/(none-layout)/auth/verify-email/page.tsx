import { Suspense } from 'react';
import VerifyEmail from '@/app/(none-layout)/auth/verify-email/_components/VerifyEmail';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={'<p>...loading</p>'}>
      <VerifyEmail />
    </Suspense>
  );
}
