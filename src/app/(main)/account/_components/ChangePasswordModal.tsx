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

  const { mutate: changePassword, isPending } = useMutation({
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
    // <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
    //   <div className="z-[110] w-96 rounded-lg bg-white p-6 shadow-lg">
    //     <h3 className="mb-4 text-lg font-semibold">비밀번호 변경</h3>
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
      size={'w-[480px]'}
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

        {/*<PasswordInput*/}
        {/*  label="현재 비밀번호"*/}
        {/*  value={currentPassword}*/}
        {/*  onChange={setCurrentPassword}*/}
        {/*  placeholder="현재 비밀번호를 입력해주세요"*/}
        {/*/>*/}

        {/*<PasswordInput*/}
        {/*  label="새 비밀번호"*/}
        {/*  value={newPassword}*/}
        {/*  onChange={(val) => {*/}
        {/*    setNewPassword(val);*/}
        {/*    if (passwordError) setPasswordError('');*/}
        {/*  }}*/}
        {/*  placeholder="새로운 비밀번호를 입력해주세요"*/}
        {/*/>*/}
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

        {/*<PasswordInput*/}
        {/*  label="새 비밀번호 확인"*/}
        {/*  value={confirmPassword}*/}
        {/*  onChange={setConfirmPassword}*/}
        {/*  placeholder="새로운 비밀번호를 다시 입력해주세요"*/}
        {/*/>*/}

        <Input
          label="새 비밀번호 확인"
          type="password"
          placeholder="새로운 비밀번호를 다시 입력해주세요"
          value={confirmPassword ?? ''}
          onChange={(e) => setConfirmPassword(e.currentTarget?.value ?? '')}
          clearable
          onClear={() => setConfirmPassword('')}
        />

        {/*<div className="mt-6 flex justify-end gap-2">*/}
        {/*  <button className="btn btn-sm btn-outline" onClick={clear}>*/}
        {/*    취소*/}
        {/*  </button>*/}
        {/*  <button*/}
        {/*    className="btn btn-sm btn-primary"*/}
        {/*    onClick={handleSubmit}*/}
        {/*    disabled={isPending}*/}
        {/*  >*/}
        {/*    저장*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
