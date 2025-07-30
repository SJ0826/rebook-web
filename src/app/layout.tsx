import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { QueryProviders } from '@/lib/contexts/QueryClientProvider';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import './globals.css';
import { ModalProvider } from '@/hooks/useModalStack';

// 폰트
const pretendard = localFont({
  src: [
    {
      path: '../fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap', // 폰트 로딩 중에도 텍스트 표시
  preload: true, // 폰트 미리 로드
});

// 메타데이터
export const metadata: Metadata = {
  title: 'Rebook',
  description: 'Rebook: 다시 읽고 다시 나누다',
};

// 레이아웃
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} font-pretendard flex min-h-screen flex-col`}
      >
        <QueryProviders>
          <ToastProvider>
            <ModalProvider>{children}</ModalProvider>
          </ToastProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
