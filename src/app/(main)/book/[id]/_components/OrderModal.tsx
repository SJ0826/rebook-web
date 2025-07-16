import React from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui';

interface Props {
  onClickCancel: () => void;
  onClickConfirm: () => void;
}

const OrderModal = ({ onClickCancel, onClickConfirm }: Props) => {
  return (
    <Modal>
      <div>
        <h3 className="text-xl font-bold">거래를 시작할까요?</h3>
        <p className="py-4">
          이 책에 대해 판매자에게 거래를 제안하고 채팅방을 생성할게요.
        </p>

        {/* footer */}
        <div className={'pt-6'}>
          <div className={'flex justify-end gap-3'}>
            <Button onClick={onClickCancel} color={'gray'} variant={'line-sub'}>
              취소
            </Button>
            <Button className="btn btn-primary" onClick={onClickConfirm}>
              네, 시작할게요
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
