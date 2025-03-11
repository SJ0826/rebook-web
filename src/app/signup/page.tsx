'use client';
import { useState } from 'react';
import { useRegisterMutation } from '@/hooks/useAuthMutation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { mutate } = useRegisterMutation();

  // 이메일 형식 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이름 검사 (최소 2글자)
  const validateName = (name: string) => {
    return name.length >= 2;
  };

  // 비밀번호 강도 검사 (8자 이상, 영문+숫자+특수문자 포함)
  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // 이메일 입력 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(
      validateEmail(e.target.value) ? '' : '올바른 이메일 형식을 입력하세요.'
    );
  };

  // 이름 입력 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(
      validateName(e.target.value)
        ? ''
        : '이름은 최소 2글자 이상 입력해야 합니다.'
    );
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(
      validatePassword(e.target.value)
        ? ''
        : '비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.'
    );
  };

  // 비밀번호 재입력 확인
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(
      e.target.value === password ? '' : '비밀번호가 일치하지 않습니다.'
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ email, name, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
          <label className="form-control w-full">
            <span className="label-text">이메일</span>
            <input
              type="email"
              placeholder="이메일 입력"
              className="input input-bordered w-full"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </label>

          {/* 이름 입력 (2글자 이상) */}
          <label className="form-control w-full">
            <span className="label-text">이름</span>
            <input
              type="text"
              placeholder="이름 입력"
              className="input input-bordered w-full"
              value={name}
              onChange={handleNameChange}
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </label>

          {/* 비밀번호 입력 */}
          <label className="form-control w-full">
            <span className="label-text">비밀번호</span>
            <input
              type="password"
              placeholder="비밀번호 입력"
              className="input input-bordered w-full"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </label>

          {/* 비밀번호 재입력 */}
          <label className="form-control w-full">
            <span className="label-text">비밀번호 재입력</span>
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </label>

          <button type="submit" className="btn btn-primary w-full">
            회원가입
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-primary font-semibold">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}
