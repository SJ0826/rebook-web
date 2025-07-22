import React from 'react';
import { Button } from '@/components/ui/index';

const ModalFooter = ({
  subButtonText = '취소',
  mainButtonText = '확인',
  onClickSubButton,
  onClickMainButton,
}: {
  subButtonText?: string;
  mainButtonText?: string;
  onClickSubButton: () => void;
  onClickMainButton: () => void;
}) => {
  return (
    <div className={'flex justify-end gap-3 p-4'}>
      <Button onClick={onClickSubButton} color={'gray'} variant={'line-sub'}>
        {subButtonText}
      </Button>
      <Button className="btn btn-primary" onClick={onClickMainButton}>
        {mainButtonText}
      </Button>
    </div>
  );
};

export default ModalFooter;
