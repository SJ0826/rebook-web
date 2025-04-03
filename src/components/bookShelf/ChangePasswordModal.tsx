'use client';

import React, { useState } from 'react';
import { useToast } from '@/lib/contexts/ToastContext';
import { validatePassword } from '@/lib/utils/validation';
import { useMutation } from '@tanstack/react-query';
import { changePasswordAPI } from '@/lib/api/auth';

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { showToast } = useToast();

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
          onClose();
        },
        onError: () => {
          showToast('현재 비밀번호가 일치하지 않습니다.', 'error');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="z-[110] w-96 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">비밀번호 변경</h3>

        <PasswordInput
          label="현재 비밀번호"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="현재 비밀번호를 입력해주세요"
        />

        <PasswordInput
          label="새 비밀번호"
          value={newPassword}
          onChange={(val) => {
            setNewPassword(val);
            if (passwordError) setPasswordError('');
          }}
          placeholder="새로운 비밀번호를 입력해주세요"
        />
        {passwordError && (
          <p className="mt-1 text-sm text-red-500">{passwordError}</p>
        )}

        <PasswordInput
          label="새 비밀번호 확인"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="새로운 비밀번호를 다시 입력해주세요"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSubmit}
            disabled={isPending}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => (
  <>
    <label className="label mt-2">
      <span className="label-text">{label}</span>
    </label>
    <input
      type="password"
      className="input input-bordered w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </>
);
