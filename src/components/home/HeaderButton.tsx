import React, { ReactElement } from 'react';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/contexts/ToastContext';
import { Button } from '@/components/ui';

interface HeaderButtonProps {
  icon: ReactElement;
  title: string;
  path: string;
}

const HeaderButton = ({ icon, title, path }: HeaderButtonProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();

  // 로그인 여부에 따라 이동 or 토스트
  const handleRouteWithAuth = (route: string) => {
    if (isLoggedIn) {
      router.push(route);
    } else {
      showToast('로그인이 필요한 서비스입니다.', 'info');
      router.push(ROUTES.LOGIN);
    }
  };
  return (
    <Button
      variant={'line-none'}
      className={'text-secondary-700 flex flex-col gap-1'}
      onClick={() => handleRouteWithAuth(path)}
    >
      <div className={'h-8 w-8'}>{icon}</div>
      <span className={'text-baseg'}>{title}</span>
    </Button>
  );
};

export default HeaderButton;
