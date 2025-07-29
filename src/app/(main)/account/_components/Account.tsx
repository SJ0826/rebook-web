'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import {
  useMyProfileMutation,
  useMyProfileQuery,
} from '@/hooks/mutations/useAuthMutation';

import { uploadImagesAPI } from '@/lib/api/files';
import { useToast } from '@/lib/contexts/ToastContext';
import { useModalStack } from '@/hooks/useModalStack';
import ChangePasswordModal from '@/app/(main)/account/_components/ChangePasswordModal';

const Account = () => {
  const { data: profileData } = useMyProfileQuery();
  const { mutate: updateProfileMutate } = useMyProfileMutation();
  const { showToast } = useToast();
  const { push } = useModalStack();

  const [currentImageUrl, setCurrentImageUrl] = useState(profileData?.imageUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📌 이미지 업로드 및 수정 처리
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const { files: uploaded } = await uploadImagesAPI(Array.from(files));
      const newUrl = uploaded[0].imageUrl;
      setCurrentImageUrl(newUrl);

      updateProfileMutate({ imageUrl: newUrl });
      showToast('프로필 이미지가 변경되었습니다.', 'success');
    } catch {
      showToast('이미지 업로드에 실패했습니다.', 'error');
    }
  };

  // 📌 프로필 이미지 동기화
  useEffect(() => {
    setCurrentImageUrl(profileData?.imageUrl);
  }, [profileData?.imageUrl]);

  return (
    <div className={'mx-auto flex min-w-[300px] flex-col gap-6 pt-6'}>
      <div
        className={'h-[1px] w-full border-t border-dashed border-gray-200'}
      />

      {/* 프로필 */}
      <div className={'flex flex-col items-center'}>
        {currentImageUrl && (
          <Image
            src={currentImageUrl}
            alt="프로필 사진"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        )}

        <span className="mt-4 text-center text-2xl font-semibold">
          {profileData?.name}
        </span>
        <span className="text-center text-gray-500">{profileData?.email}</span>

        {/* 파일 선택 input (숨김) */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div
        className={'h-[1px] w-full border-t border-dashed border-gray-200'}
      />

      {/* 액션 버튼 리스트 */}
      <div className={'flex w-full flex-col gap-4'}>
        <Button
          variant={'line-sub'}
          size={'lg'}
          color={'gray'}
          className={'flex-1'}
        >
          <span>프로필 수정</span>
        </Button>
        <Button
          onClick={() => {
            push({
              key: 'ChangePasswordModal',
              modal: <ChangePasswordModal />,
            });
          }}
          variant={'line-sub'}
          size={'lg'}
          color={'gray'}
          className={'flex-1'}
        >
          <span>비밀번호 변경</span>
        </Button>
        <Button
          variant={'line-sub'}
          size={'lg'}
          color={'gray'}
          className={'flex-1'}
        >
          <span>로그아웃</span>
        </Button>
        <Button
          variant={'line-sub'}
          size={'lg'}
          color={'gray'}
          className={'flex-1'}
        >
          <span>회원탈퇴</span>
        </Button>
      </div>
    </div>
  );
};

export default Account;
