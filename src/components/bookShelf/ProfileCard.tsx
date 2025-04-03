'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/24/outline';
import {
  useMyProfileMutation,
  useMyProfileQuery,
} from '@/hooks/useAuthMutation';
import { uploadImagesAPI } from '@/lib/api/files';
import { useToast } from '@/lib/contexts/ToastContext';
import { twMerge } from 'tailwind-merge';
import EditNameModal from '@/components/bookShelf/EditNameModal';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import LogoutConfirmModal from '@/components/common/LogoutConfirmModal';
import ChangePasswordModal from '@/components/bookShelf/ChangePasswordModal';

const ProfileCard = () => {
  const { data: profileData } = useMyProfileQuery();
  const { mutate: updateProfileMutate } = useMyProfileMutation();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(profileData?.imageUrl);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    <div className="card bg-base-100 border-base-200 w-full border shadow-md">
      <div className="card-body flex flex-col items-center gap-6 md:flex-row">
        {/*  프로필 이미지 */}
        <div className="avatar relative">
          {currentImageUrl && (
            <Image
              src={currentImageUrl}
              alt="프로필 사진"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          )}

          {/*  수정 버튼 */}
          <EditButton onClick={() => fileInputRef.current?.click()} />

          {/* 파일 선택 input (숨김) */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/*  유저 정보 + 버튼 */}
        <div className="flex flex-1 flex-col gap-2">
          <div className={'bottom-0 flex items-center gap-2'}>
            <span className="text-center text-lg font-semibold md:text-left">
              {profileData?.name}
            </span>
            <EditButton
              onClick={() => setShowEditNameModal(true)}
              className={'relative bottom-0 h-5 w-5'}
              iconClassName={'w-3 h-3'}
            />
          </div>

          <span className="text-center text-sm text-gray-500 md:text-left">
            {profileData?.email}
          </span>

          <div className="mt-2 flex justify-center gap-2 md:justify-start">
            <button
              className="btn btn-sm btn-outline btn-warning"
              onClick={() => setShowChangePasswordModal(true)}
            >
              비밀번호 변경
            </button>
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => setShowLogoutModal(true)}
            >
              로그아웃
            </button>
            <button className="btn btn-sm btn-outline">회원탈퇴</button>
          </div>
        </div>
      </div>

      {/* 이름 변경 모달 */}
      <EditNameModal
        showEditModal={showEditNameModal}
        currentName={profileData?.name ?? ''}
        onClose={() => setShowEditNameModal(false)}
      />

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={() => {
            logout();
            router.push(ROUTES.HOME);
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

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
        'absolute right-0 bottom-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white',
        className
      )}
    >
      <PencilIcon className={twMerge('h-4 w-4 text-gray-600', iconClassName)} />
    </button>
  );
};
