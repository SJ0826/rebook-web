import React, { Dispatch, SetStateAction } from 'react';

interface LogoutModalProps {
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>;
  handleLogoutConfirm: () => void;
}

const LogoutModal = ({
  setShowLogoutModal,
  handleLogoutConfirm,
}: LogoutModalProps) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">로그아웃 하시겠습니까?</h3>
        <div className="modal-action">
          <button onClick={handleLogoutConfirm} className=" btn btn-primary">
            예
          </button>
          <button onClick={() => setShowLogoutModal(false)} className="btn">
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
