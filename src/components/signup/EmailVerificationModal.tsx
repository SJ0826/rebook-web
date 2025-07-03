'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { useMutation } from '@tanstack/react-query';
import { resendVerificationEmailAPI } from '@/lib/api/auth';
import { triggerToast } from '@/lib/contexts/ToastContext';
import { Button } from '@/components/ui';

const EmailVerificationModal = ({ email }: { email: string }) => {
  const { mutate: resendVerificationEmailMutate, isPending } = useMutation({
    mutationFn: () => resendVerificationEmailAPI({ email }),
    onSuccess: () => {
      triggerToast('입력하신 이메일로 인증 메일을 다시 보냈어요.', 'success');
    },
    onError: (error) => {
      triggerToast(error.message, 'error');
    },
  });

  return (
    <Modal
      hasHeader
      title="이메일 인증 안내"
      footer={
        <div className="flex flex-col-reverse items-center justify-end gap-3 p-6 pt-4 sm:flex-row">
          <Button
            onClick={() => resendVerificationEmailMutate()}
            size={'lg'}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? '재전송 중...' : '인증 메일 다시 보내기'}
          </Button>
        </div>
      }
      size={'w-[480px]'}
    >
      <div className="space-y-6 text-sm text-gray-700 sm:text-base">
        <p className="leading-relaxed">
          가입하신 이메일로 인증 링크를 전송했어요.
          <br />
          <span className="font-medium">받은 메일함 또는 스팸함</span>을 꼭
          확인해주세요!
        </p>

        <p className="leading-relaxed">
          이메일 주소를 잘못 입력하셨다면,
          <br />
          <span className="font-medium">
            고객문의를 통해 이메일 주소 수정을 요청해주세요.
          </span>
        </p>

        <p className="text-gray-600">
          가입 이메일 주소: <span className="font-medium">{email}</span>
        </p>
      </div>
    </Modal>
  );
};

export default EmailVerificationModal;
