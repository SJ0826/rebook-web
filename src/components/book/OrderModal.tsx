import React from 'react';
import Modal from '@/components/ui/Modal';

interface Props {
  onClickCancel: () => void;
  onClickConfirm: () => void;
}

const OrderModal = ({ onClickCancel, onClickConfirm }: Props) => {
  return (
    <Modal>
      <div>
        <h3 className="text-lg font-bold">거래를 시작할까요?</h3>
        <p className="py-4">
          이 책에 대해 판매자에게 거래를 제안하고 채팅방을 생성할게요.
        </p>
        <div>
          <button className="btn btn-outline" onClick={onClickCancel}>
            취소
          </button>
          <button className="btn btn-primary" onClick={onClickConfirm}>
            네, 시작할게요
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
