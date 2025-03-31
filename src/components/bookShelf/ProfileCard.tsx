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

const ProfileCard = () => {
  const { data: profileData } = useMyProfileQuery();
  const { mutate: updateProfileMutate } = useMyProfileMutation();
  const { showToast } = useToast();

  const [currentImageUrl, setCurrentImageUrl] = useState(profileData?.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="card w-full bg-base-100 shadow-md border border-base-200">
      <div className="card-body flex flex-col md:flex-row items-center gap-6">
        {/*  프로필 이미지 */}
        <div className="relative avatar">
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
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-0 bottom-2 w-7 h-7 bg-white rounded-full border border-gray-400 p-1"
          >
            <PencilIcon className="w-4 h-4 text-gray-600" />
          </button>

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
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-lg font-semibold text-center md:text-left">
            {profileData?.name}
          </span>
          <span className="text-sm text-gray-500 text-center md:text-left">
            {profileData?.email}
          </span>

          <div className="flex gap-2 mt-2 justify-center md:justify-start">
            <button className="btn btn-sm btn-outline btn-warning">
              비밀번호 변경
            </button>
            <button className="btn btn-sm btn-outline btn-error">
              로그아웃
            </button>
            <button className="btn btn-sm btn-outline">회원탈퇴</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
