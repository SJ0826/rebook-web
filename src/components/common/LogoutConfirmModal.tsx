'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useModalStack } from '@/hooks/useModalStack';
import ModalFooter from '@/components/ui/ModalFooter';
import { ROUTES } from '@/lib/constants';

const LogoutConfirmModal = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { clear } = useModalStack();

  const handleLogout = () => {
    logout();
    clear();
    router.push(ROUTES.HOME);
  };
  return (
    <Modal
      footer={
        // <div className="mt-4 flex justify-end gap-2">
        //   <button className="btn btn-sm btn-outline" onClick={clear}>
        //     취소
        //   </button>
        //   <button
        //     className="btn btn-sm btn-error"
        //     onClick={() => {
        //       logout();
        //       clear();
        //       router.push(ROUTES.HOME);
        //     }}
        //   >
        //     로그아웃
        //   </button>
        // </div>
        <ModalFooter
          onClickSubButton={clear}
          mainButtonText={'로그아웃'}
          onClickMainButton={handleLogout}
        />
      }
    >
      <h3 className="mb-4 text-center text-lg font-semibold">
        정말 로그아웃하시겠어요?
      </h3>
    </Modal>
  );
};

export default LogoutConfirmModal;
