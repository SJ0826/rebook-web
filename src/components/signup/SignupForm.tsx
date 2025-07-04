import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { signupUserAPI } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

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

const SignupForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 회원가입 뮤테이션 (이메일 인증 요청)
  const { mutate } = useMutation({
    mutationFn: signupUserAPI,
  });

  // 회원가입 폼 검증
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

    if (!formData.password || formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // input onChange 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 회원가입 (이메일 인증 요청) 핸들러
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
        onSuccess: () => {
          router.push(ROUTES.AUTH_SEND_EMAIL);
        },
        onError: (error) => {
          // if (axios.isAxiosError(error)) {
          //   showToast(error.response?.data?.message, 'error');
          // } else {
          //   showToast('알 수 없는 오류가 발생했습니다.', 'error');
          // }
          console.log(error);
        },
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  // 렌더링
  return (
    <div className={'flex h-screen items-center justify-center'}>
      <div
        className={'flex max-w-100 flex-col items-center justify-center px-5'}
      >
        <h1
          className={
            'text-secondary-700 flex flex-wrap items-end gap-1 text-center text-3xl font-bold md:text-4xl'
          }
        >
          <strong>Rebook:</strong>
          <span className={'text-xl md:text-2xl'}>다시 읽고 다시 나누다</span>
        </h1>

        <div
          className={'mt-2 mb-8 w-full border-t-[1px] border-dashed md:w-100'}
        />

        <form onSubmit={handleSubmit} className={'flex flex-col gap-6'}>
          <Input
            label={'이메일'}
            value={formData.email}
            onChange={handleChange}
            id="email"
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요"
            error={errors.email}
            helperText={errors.email}
          />

          <Input
            label={'이름'}
            value={formData.name}
            onChange={handleChange}
            id="name"
            type="name"
            name="name"
            placeholder="이름을 입력해주세요"
            error={errors.name}
          />

          <Input
            label={'비밀번호'}
            id={'password'}
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요"
            value={formData.password}
            onChange={handleChange}
            helperText={'8자 이상, 영문, 숫자, 특수문자 포함'}
            error={errors.password}
          />

          <Input
            label={'비밀번호 재입력'}
            id={'confirmPassword'}
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요"
            value={formData.confirmPassword}
            onChange={handleChange}
            helperText={'8자 이상, 영문, 숫자, 특수문자 포함'}
            error={errors.confirmPassword}
          />

          <Button type="submit" disabled={isSubmitting} size={'lg'}>
            {isSubmitting ? '처리중...' : '이메일 인증 요청'}
          </Button>
        </form>
        <p className={'text- mt-2 text-sm text-gray-600'}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" prefetch>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
