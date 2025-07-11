'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/lib/constants';
import { verifyEmailAPI } from '@/lib/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const { setIsLoggedIn, setAccessToken } = useAuth();

  const { mutate } = useMutation({
    mutationFn: (token: string) => verifyEmailAPI(token),
    onSuccess: (data) => {
      setStatus('success');
      setMessage('🎉 이메일 인증이 완료되었습니다!');
      setAccessToken(data.accessToken);
      setIsLoggedIn(true);
    },
    onError: () => {
      setStatus('error');
      setMessage('인증 중 문제가 발생했습니다.');
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('토큰이 누락되었습니다.');
      return;
    }

    mutate(token);
  }, [searchParams]);

  // 성공 시 3초 뒤 홈으로 이동
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push(ROUTES.HOME);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-6 text-center">
        {status === 'loading' && (
          <>
            <span className="loading loading-spinner text-primary"></span>
            <p className="mt-4 text-sm text-gray-700">
              이메일 인증 중입니다...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 className="text-2xl font-bold text-success">인증 완료 ✅</h2>
            <p className="mt-2 text-gray-700">{message}</p>
            <p className="text-sm mt-2 text-gray-500">
              3초 후 홈으로 이동합니다.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="text-2xl font-bold text-error">인증 실패 ❌</h2>
            <p className="mt-2 text-gray-700">{message}</p>
            <div className="flex justify-center gap-2 mt-4">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => router.push(ROUTES.LOGIN)}
              >
                로그인
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => router.push(ROUTES.SIGNUP)}
              >
                회원가입
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
