'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useLoginMutation } from '@/hooks/useAuthMutation';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/lib/contexts/ToastContext';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
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
    <div className="flex justify-center items-center min-h-screen bg-base-200 rounded-field">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        <form className="flex flex-col mt-4 gap-4" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <span className="label-text">아이디</span>
            <input
              type="email"
              name="email"
              placeholder="이메일 입력"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">비밀번호</span>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <button
            type="submit"
            disabled={
              formData.email.length === 0 || formData.password.length === 0
            }
            className="btn btn-primary w-full"
          >
            로그인
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          계정이 없으신가요?{' '}
          <a href="/signup" className="text-primary font-semibold">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
