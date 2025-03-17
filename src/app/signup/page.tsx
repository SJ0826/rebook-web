'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterMutation } from '@/hooks/useAuthMutation';
import { ROUTES } from '@/lib/constants';
import { useToast } from '@/lib/contexts/ToastContext';
import axios from 'axios';

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  minNameLength: 2,
};

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useRegisterMutation();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!VALIDATION.email.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력하세요.';
    }

    if (formData.name.length < VALIDATION.minNameLength) {
      newErrors.name = '이름은 최소 2글자 이상 입력해야 합니다.';
    }

    if (!VALIDATION.password.test(formData.password)) {
      newErrors.password =
        '비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 타이핑시 에러 상태 해제
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    mutate(
      {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      },
      {
        onSuccess: () => router.push(ROUTES.HOME),
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            showToast(error.response?.data?.message, 'error');
          } else {
            showToast('알 수 없는 오류가 발생했습니다.', 'error');
          }
        },
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4 rounded-field">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6 ">
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <span className="label-text">이메일</span>
            <input
              type="email"
              name="email"
              placeholder="이메일 입력"
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </label>

          <label className="form-control w-full">
            <span className="label-text">이름</span>
            <input
              type="text"
              name="name"
              placeholder="이름 입력"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </label>

          <label className="form-control w-full">
            <span className="label-text">비밀번호</span>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 입력"
              className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
            />
            <span className="label-text-alt text-gray-500 mt-1">
              8자 이상, 영문, 숫자, 특수문자 포함
            </span>
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password}</p>
            )}
          </label>

          <label className="form-control w-full">
            <span className="label-text">비밀번호 재입력</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                처리중...
              </>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-primary font-semibold">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
