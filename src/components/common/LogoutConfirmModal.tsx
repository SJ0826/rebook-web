'use client';

import React from 'react';

const LogoutConfirmModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-center text-lg font-semibold">
          정말 로그아웃하시겠어요?
        </h3>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-sm btn-outline" onClick={onCancel}>
            취소
          </button>
          <button className="btn btn-sm btn-error" onClick={onConfirm}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
