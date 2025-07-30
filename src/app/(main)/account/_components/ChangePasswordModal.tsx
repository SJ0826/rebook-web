'use client';

import React, { useState } from 'react';
import { useToast } from '@/lib/contexts/ToastContext';
import { validatePassword } from '@/lib/utils/validation';
import { useMutation } from '@tanstack/react-query';
import { changePasswordAPI } from '@/lib/api/auth';
import Modal from '@/components/ui/Modal';
import { useModalStack } from '@/hooks/useModalStack';
import { Input } from '@/components/ui';
import ModalFooter from '@/components/ui/ModalFooter';

const ChangePasswordModal = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { showToast } = useToast();
  const { clear } = useModalStack();

  const { mutate: changePassword } = useMutation({
    mutationFn: changePasswordAPI,
  });

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('모든 비밀번호를 입력해주세요.', 'error');
      return;
    }

    const isValid = validatePassword(newPassword);
    if (!isValid) {
      setPasswordError(
        '비밀번호는 8자 이상, 영문/숫자/특수문자를 모두 포함해야 합니다.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('새 비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    setPasswordError('');

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          showToast('비밀번호가 변경되었습니다.', 'success');
          clear();
        },
        onError: () => {
          showToast('현재 비밀번호가 일치하지 않습니다.', 'error');
        },
      }
    );
  };

  return (
    <Modal
      hasHeader
      title={'비밀번호를 변경해주세요'}
      footer={
        <ModalFooter
          mainButtonText={'변경하기'}
          onClickSubButton={clear}
          onClickMainButton={handleSubmit}
        />
      }
      size={'w-[580px]'}
    >
      <div className={'flex flex-col gap-6 px-4'}>
        <Input
          label={'현재 비밀번호'}
          type="password"
          placeholder="현재 비밀번호를 입력해주세요"
          value={currentPassword ?? ''}
          onChange={(e) => setCurrentPassword(e.currentTarget?.value ?? '')}
          clearable
          onClear={() => setCurrentPassword('')}
        />

        <Input
          label={'새 비밀번호'}
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
          value={newPassword ?? ''}
          onChange={(e) => setNewPassword(e.currentTarget?.value ?? '')}
          clearable
          onClear={() => setNewPassword('')}
        />
        {passwordError && (
          <p className="mt-1 text-sm text-red-500">{passwordError}</p>
        )}

        <Input
          label="새 비밀번호 확인"
          type="password"
          placeholder="새로운 비밀번호를 다시 입력해주세요"
          value={confirmPassword ?? ''}
          onChange={(e) => setConfirmPassword(e.currentTarget?.value ?? '')}
          clearable
          onClear={() => setConfirmPassword('')}
        />
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
