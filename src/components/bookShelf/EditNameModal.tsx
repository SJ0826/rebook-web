'use client';

import React, { useEffect, useState } from 'react';
import { useMyProfileMutation } from '@/hooks/useAuthMutation';
import { useToast } from '@/lib/contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

const EditNameModal = ({
  showEditModal,
  currentName,
  onClose,
}: {
  showEditModal: boolean;
  currentName: string;
  onClose: () => void;
}) => {
  const [newName, setNewName] = useState(currentName);
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: updateProfileMutate, isPending } = useMyProfileMutation();

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleSave = () => {
    if (newName.trim().length === 0) {
      showToast('닉네임을 입력해주세요.', 'error');
      return;
    }

    updateProfileMutate(
      { name: newName },
      {
        onSuccess: () => {
          showToast('닉네임이 변경되었습니다.', 'success');
          queryClient.invalidateQueries({ queryKey: ['myProfile'] });
          onClose();
        },
        onError: () => {
          showToast('닉네임 변경에 실패했습니다.', 'error');
        },
      }
    );
  };

  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">닉네임 수정</h3>
        <input
          type="text"
          className="input input-bordered w-full"
          value={newName}
          placeholder={'두글자 이상 입력해주세요'}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
            disabled={
              isPending || newName.length < 2 || newName === currentName
            }
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNameModal;
