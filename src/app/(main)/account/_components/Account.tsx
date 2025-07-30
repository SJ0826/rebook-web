'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import ChangePasswordModal from '@/app/(main)/account/_components/ChangePasswordModal';
import EditNameModal from '@/app/(main)/account/_components/EditNameModal';
import { useMyProfileQuery } from '@/hooks/mutations/useAuthMutation';
import { useModalStack } from '@/hooks/useModalStack';
import { useToast } from '@/lib/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import WithdrawalModal from '@/app/(main)/account/_components/WithdrawalModal';

const Account = () => {
  const router = useRouter();

  const { data: profileData } = useMyProfileQuery();

  const { logout } = useAuth();
  const { push, clear } = useModalStack();
  const { showToast } = useToast();

  // 📌 로그아웃 핸들러
  const handleLogout = async () => {
    logout();
    clear();
    router.push(ROUTES.HOME);
    showToast('로그아웃에 성공했습니다', 'success');
  };

  return (
    <div className={'mx-auto flex min-w-[300px] flex-col gap-6 pt-6'}>
      <div
        className={'h-[1px] w-full border-t border-dashed border-gray-200'}
      />

      {/* 프로필 */}
      <div className={'flex flex-col items-center'}>
        {profileData && (
          <Image
            src={profileData.imageUrl}
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
      </div>

      <div
        className={'h-[1px] w-full border-t border-dashed border-gray-200'}
      />

      {/* 액션 버튼 리스트 */}
      <div className={'flex w-full flex-col gap-4'}>
        <Button
          onClick={() => {
            push({ key: 'EditNameModal', modal: <EditNameModal /> });
          }}
          variant={'line-sub'}
          size={'lg'}
          color={'gray'}
          className={'flex-1 bg-white'}
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
          className={'flex-1 bg-white'}
        >
          <span>비밀번호 변경</span>
        </Button>
        <Button
          onClick={handleLogout}
          variant={'line-sub'}
          size={'lg'}
          color={'gray'}
          className={'flex-1 bg-white'}
        >
          <span>로그아웃</span>
        </Button>
        <Button
          onClick={() =>
            push({ key: 'WithdrawalModal', modal: <WithdrawalModal /> })
          }
          variant={'line-sub'}
          size={'lg'}
          color={'gray'}
          className={'flex-1 bg-white'}
        >
          <span>회원탈퇴</span>
        </Button>
      </div>
    </div>
  );
};

export default Account;
