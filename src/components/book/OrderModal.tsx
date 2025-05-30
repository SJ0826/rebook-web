import React from 'react';

interface Props {
  onClickCancel: () => void;
  onClickConfirm: () => void;
}

const OrderModal = ({ onClickCancel, onClickConfirm }: Props) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">거래를 시작할까요?</h3>
        <p className="py-4">
          이 책에 대해 판매자에게 거래를 제안하고 채팅방을 생성할게요.
        </p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClickCancel}>
            취소
          </button>
          <button className="btn btn-primary" onClick={onClickConfirm}>
            네, 시작할게요
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
