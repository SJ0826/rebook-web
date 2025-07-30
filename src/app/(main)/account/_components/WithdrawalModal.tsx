import React from 'react';
import Modal from '@/components/ui/Modal';
import ModalFooter from '@/components/ui/ModalFooter';
import { useModalStack } from '@/hooks/useModalStack';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useToast } from '@/lib/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';

const WithdrawalModal = () => {
  const router = useRouter();
  const { clear } = useModalStack();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const onWithdrawal = () => {
    logout();
    clear();
    router.push(ROUTES.HOME);
    showToast(
      '아쉽지만, 언제든 돌아올 수 있어요! 탈퇴가 완료되었습니다.',
      'success'
    );
  };

  return (
    <Modal
      size={'w-[480px]'}
      footer={
        <ModalFooter
          onClickMainButton={onWithdrawal}
          onClickSubButton={clear}
          mainButtonText={'탈퇴하기'}
        />
      }
    >
      <div className={'space-y-1'}>
        <p className={'text-lg font-semibold'}>
          정말 회원 탈퇴를 진행하시겠어요?
        </p>
        <p>회원탈퇴 후 구매/판매 이력이 모두 삭제됩니다.</p>
      </div>
    </Modal>
  );
};

export default WithdrawalModal;
