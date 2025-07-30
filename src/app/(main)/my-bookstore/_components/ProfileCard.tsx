'use client';

import React from 'react';
import { useMyProfileQuery } from '@/hooks/mutations/useAuthMutation';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';

const ProfileCard = () => {
  const { data: profileData } = useMyProfileQuery();

  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div
      className={
        'mt-6 flex w-full flex-col items-center md:mt-0 md:items-start'
      }
    >
      {/*  프로필 이미지 */}
      <div className="relative">
        {profileData?.imageUrl && (
          <Image
            src={profileData?.imageUrl}
            alt="프로필 사진"
            width={100}
            height={100}
            className="rounded-full object-cover md:w-[296px]"
          />
        )}
      </div>

      {/*  유저 정보  */}
      <div className="flex w-full flex-col items-center py-4 md:items-start">
        <span className="text-center text-2xl font-semibold">
          {profileData?.name}
        </span>
        <span className="text-center text-lg text-gray-500">
          {profileData?.email}
        </span>
      </div>

      {/* 액션 버튼 */}
      <div className={'flex w-full gap-2 px-2 md:flex-col md:px-0'}>
        <Button
          variant={'line-sub'}
          color={'gray'}
          size={isDesktop ? 'md' : 'sm'}
          className={'flex-1'}
          onClick={() => router.push(ROUTES.ACCOUNT)}
        >
          <PencilSquareIcon width={16} className={'mr-2'} />
          마이 페이지
        </Button>
      </div>

      {/*/!* 이름 변경 모달 *!/*/}
      {/*<EditNameModal*/}
      {/*  showEditModal={showEditNameModal}*/}
      {/*  currentName={profileData?.name ?? ''}*/}
      {/*  onClose={() => setShowEditNameModal(false)}*/}
      {/*/>*/}
    </div>
  );
};

export default ProfileCard;
