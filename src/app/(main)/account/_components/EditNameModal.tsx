'use client';

import React, { useRef, useState } from 'react';
import { useMyProfileQuery } from '@/hooks/mutations/useAuthMutation';
import { useToast } from '@/lib/contexts/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ModalFooter from '@/components/ui/ModalFooter';
import Modal from '@/components/ui/Modal';
import { useModalStack } from '@/hooks/useModalStack';
import { Input } from '@/components/ui';
import { uploadImagesAPI } from '@/lib/api/files';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/24/outline';
import { updateMyProfile } from '@/lib/api/my';

const EditNameModal = () => {
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { clear } = useModalStack();
  const { data: profileData } = useMyProfileQuery();

  const [currentImageUrl, setCurrentImageUrl] = useState(profileData?.imageUrl);

  // 📌 이미지 미리보기
  const { mutate: handleImageChange } = useMutation({
    mutationFn: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const { files: uploaded } = await uploadImagesAPI(Array.from(files));
      const newUrl = uploaded[0].imageUrl;
      setCurrentImageUrl(newUrl);
    },
  });

  // 📌 프로필 수정하기
  const { mutate: handleSave } = useMutation({
    mutationFn: async () => {
      if (newName.trim().length === 0) {
        showToast('닉네임을 입력해주세요', 'error');
        return;
      }

      return await updateMyProfile({
        name: newName,
        imageUrl: currentImageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      clear();
      showToast('프로필을 변경했습니다', 'success');
    },
    onError: (e) => {
      showToast(
        '프로필을 변경하지 못했어요. 잠시 후에 다시 시도해주세요',
        'error'
      );
      console.error(e.message);
    },
  });

  return (
    <Modal
      hasHeader
      title={'프로필을 변경해주세요'}
      footer={
        <ModalFooter
          mainButtonText={'변경하기'}
          onClickSubButton={clear}
          onClickMainButton={handleSave}
        />
      }
      size={'w-[580px]'}
    >
      <div className={'flex flex-col gap-8'}>
        <div className={'flex items-center'}>
          <span className={'min-w-[120px] font-semibold text-gray-700'}>
            프로필 이미지
          </span>
          <div className={'relative'}>
            {currentImageUrl ? (
              <Image
                width={100}
                height={100}
                src={currentImageUrl}
                alt={'프로필 이미지'}
                className={'max-h-25 max-w-25 rounded-full'}
              />
            ) : (
              <div className={'h-[100px] w-[100px]'}></div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={
                'absolute right-0 bottom-0 flex items-center justify-center rounded-full border border-gray-600 bg-white p-2'
              }
            >
              <PencilIcon className={'text-black'} width={12} height={12} />
            </button>
          </div>
          {/* 파일 선택 input (숨김) */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <Input
          label={'닉네임'}
          type="text"
          className="input input-bordered w-full"
          value={newName}
          placeholder={'두글자 이상 입력해주세요'}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default EditNameModal;
