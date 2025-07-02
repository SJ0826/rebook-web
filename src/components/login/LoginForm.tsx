'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useLoginMutation } from '@/hooks/mutations/useAuthMutation';
import { ROUTES } from '@/lib/constants';
import { useToast } from '@/lib/contexts/ToastContext';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const { mutate: loginMutate } = useLoginMutation();
  const { showToast } = useToast();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => router.push(ROUTES.HOME),
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            showToast(error.response?.data?.message, 'error');
          } else {
            showToast('알 수 없는 오류가 발생했습니다.', 'error');
          }
        },
      }
    );
  };
  return (
    <div className={'flex items-center justify-center'}>
      <div className={'flex max-w-100 flex-col pt-30 md:pt-50'}>
        <h1
          className={
            'text-secondary-700 text-center text-3xl font-bold md:text-4xl'
          }
        >
          <strong>Rebook:</strong>{' '}
          <span className={'text-xl md:text-2xl'}>다시 읽고 다시 나누다</span>
        </h1>
        <div className={'mt-2 mb-8 w-100 border-t-[1px] border-dashed'} />
        <form onSubmit={handleSubmit} className={'flex flex-col gap-6'}>
          <Input
            label={'이메일'}
            value={formData.email}
            onChange={handleChange}
            id="email"
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요"
          />
          <Input
            label={'비밀번호'}
            id={'password'}
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            disabled={
              formData.email.length === 0 || formData.password.length === 0
            }
            className={'mt-6'}
          >
            로그인
          </Button>
        </form>
        <p className={'text- mt-2 text-sm text-gray-600'}>
          계정이 없으신가요?{' '}
          <Link href={ROUTES.SIGNUP} prefetch>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
