'use client';

import React, { useState } from 'react';
import { useToast } from '@/lib/contexts/ToastContext';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showToast } = useToast();

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const res = await axios.patch('/api/users/change-password', {
        currentPassword,
        newPassword,
      });
      return res.data;
    },
  });

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('모든 비밀번호를 입력해주세요.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('새 비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="z-60 w-96 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">비밀번호 변경</h3>

        {/* 현재 비밀번호 */}
        <label className="label">
          <span className="label-text">현재 비밀번호</span>
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        {/* 새 비밀번호 */}
        <label className="label mt-2">
          <span className="label-text">새 비밀번호</span>
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* 새 비밀번호 확인 */}
        <label className="label mt-2">
          <span className="label-text">새 비밀번호 확인</span>
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
