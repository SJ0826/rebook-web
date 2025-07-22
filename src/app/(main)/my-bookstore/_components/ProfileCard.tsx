'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import {
  useMyProfileMutation,
  useMyProfileQuery,
} from '@/hooks/mutations/useAuthMutation';
import { uploadImagesAPI } from '@/lib/api/files';
import { useToast } from '@/lib/contexts/ToastContext';
import { twMerge } from 'tailwind-merge';
import EditNameModal from '@/components/bookShelf/EditNameModal';
import ChangePasswordModal from '@/components/bookShelf/ChangePasswordModal';
import Image from 'next/image';

const ProfileCard = () => {
  const { data: profileData } = useMyProfileQuery();
  const { mutate: updateProfileMutate } = useMyProfileMutation();

  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(profileData?.imageUrl);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  //  이미지 업로드 및 수정 처리
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

  //  프로필 이미지 동기화
  useEffect(() => {
    setCurrentImageUrl(profileData?.imageUrl);
  }, [profileData?.imageUrl]);

  return (
    <div className={'flex flex-col items-start'}>
      {/*  프로필 이미지 */}
      <div className="relative">
        {currentImageUrl && (
          <Image
            src={currentImageUrl}
            alt="프로필 사진"
            width={100}
            height={100}
            className="rounded-full object-cover md:w-[296px]"
          />
        )}

        {/*  수정 버튼 */}
        {/*<EditButton onClick={() => fileInputRef.current?.click()} />*/}

        {/* 파일 선택 input (숨김) */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/*  유저 정보  */}
      <div className="flex w-full flex-col items-start py-4">
        <span className="text-center text-2xl font-semibold">
          {profileData?.name}
        </span>
        {/*<EditButton*/}
        {/*  onClick={() => setShowEditNameModal(true)}*/}
        {/*  className={'relative bottom-0 h-5 w-5'}*/}
        {/*  iconClassName={'w-3 h-3'}*/}
        {/*/>*/}

        <span className="text-center text-lg text-gray-500">
          {profileData?.email}
        </span>
      </div>

      {/*<div className="flex w-full items-center justify-between">*/}
      {/*  <div className={'flex items-center gap-8'}>*/}
      {/*    /!*  프로필 이미지 *!/*/}
      {/*    <div className="avatar relative">*/}
      {/*      {currentImageUrl && (*/}
      {/*        <Image*/}
      {/*          src={currentImageUrl}*/}
      {/*          alt="프로필 사진"*/}
      {/*          width={100}*/}
      {/*          height={100}*/}
      {/*          className="rounded-full object-cover"*/}
      {/*        />*/}
      {/*      )}*/}

      {/*      /!*  수정 버튼 *!/*/}
      {/*      <EditButton onClick={() => fileInputRef.current?.click()} />*/}

      {/*      /!* 파일 선택 input (숨김) *!/*/}
      {/*      <input*/}
      {/*        type="file"*/}
      {/*        accept="image/*"*/}
      {/*        ref={fileInputRef}*/}
      {/*        onChange={handleImageChange}*/}
      {/*        className="hidden"*/}
      {/*      />*/}
      {/*    </div>*/}

      {/*    /!*  유저 정보  *!/*/}
      {/*    <div className="flex flex-1 flex-col justify-center gap-2">*/}
      {/*      <div className={'bottom-0 flex items-center gap-2'}>*/}
      {/*        <span className="text-center text-xl font-semibold md:text-left md:text-2xl">*/}
      {/*          {profileData?.name}*/}
      {/*        </span>*/}
      {/*        <EditButton*/}
      {/*          onClick={() => setShowEditNameModal(true)}*/}
      {/*          className={'relative bottom-0 h-5 w-5'}*/}
      {/*          iconClassName={'w-3 h-3'}*/}
      {/*        />*/}
      {/*      </div>*/}

      {/*      <span className="text-center text-sm text-gray-500 md:text-left">*/}
      {/*        {profileData?.email}*/}
      {/*      </span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*/!* 액션 버튼 *!/*/}
      {/*<div className="flex items-end justify-end gap-4">*/}
      {/*  <Button*/}
      {/*    variant={'line-sub'}*/}
      {/*    color={'gray'}*/}
      {/*    className="flex min-w-fit items-center gap-2"*/}
      {/*    onClick={() => setShowChangePasswordModal(true)}*/}
      {/*  >*/}
      {/*    <KeyIcon width={16} height={16} />*/}
      {/*    <p>비밀번호 변경</p>*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    variant={'line-sub'}*/}
      {/*    color={'gray'}*/}
      {/*    className="flex min-w-fit items-center gap-2"*/}
      {/*    onClick={() => setShowLogoutModal(true)}*/}
      {/*  >*/}
      {/*    <ArrowLeftEndOnRectangleIcon width={16} height={16} />*/}
      {/*    <p>로그아웃</p>*/}
      {/*  </Button>*/}
      {/*</div>*/}

      {/* 이름 변경 모달 */}
      <EditNameModal
        showEditModal={showEditNameModal}
        currentName={profileData?.name ?? ''}
        onClose={() => setShowEditNameModal(false)}
      />

      {/* 비밀번호 변경 모달 */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileCard;

const EditButton = ({
  onClick,
  className,
  iconClassName,
}: {
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'absolute right-0 bottom-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white md:right-3 md:h-12 md:w-12',
        className
      )}
    >
      <PencilIcon
        className={twMerge(
          'h-4 w-4 text-gray-600 md:h-6 md:w-6',
          iconClassName
        )}
      />
    </button>
  );
};
