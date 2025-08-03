'use client';

import React from 'react';
import Image from 'next/image';
import EmailImage from '@public/images/email.png';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { resendVerificationEmailAPI } from '@/lib/api/auth';
import { useToast } from '@/lib/contexts/ToastContext';

const VerifyEmailNotification = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '******@*****.com';

  const { mutate: resendVerificationEmail, isPending } = useMutation({
    mutationFn: () => resendVerificationEmailAPI({ email }),
    onSuccess: () => {
      showToast('입력하신 이메일로 인증 메일을 다시 보냈어요.', 'success');
    },
    onError: () => {
      // showToast(error.message, 'error');
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Image src={EmailImage} alt={'이메일 인증 안내'} width={120} />

      <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
        이메일 인증이 필요해요
      </h1>
      <p className="text-sm leading-relaxed text-gray-600">
        가입하신 이메일 <strong>{email}</strong>로 인증 링크를 전송했어요.{' '}
        <br />
        메일함 또는 스팸함을 확인해주세요.
      </p>
      <p className="text-sm text-gray-500">
        이메일 주소를 잘못 입력하셨다면 고객센터를 통해 수정 요청해주세요.
      </p>
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
        <Button
          variant="line-sub"
          className="w-full sm:w-auto"
          onClick={() => router.push('/login')}
        >
          로그인 페이지로
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => resendVerificationEmail()}
          disabled={isPending}
        >
          {isPending ? '재전송 중...' : '인증 메일 다시 보내기'}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailNotification;
