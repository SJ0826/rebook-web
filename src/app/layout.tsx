import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { QueryProviders } from '@/lib/contexts/QueryClientProvider';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import './globals.css';
import Layout from '@/components/layout/Layout';
import AuthConfig from '@/components/common/AuthConfig';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme={'bumblebee'}>
      <body className={`${pretendard.variable} flex flex-col min-h-screen`}>
        <QueryProviders>
          <ToastProvider>
            <AuthConfig>
              <Layout>{children}</Layout>
            </AuthConfig>
          </ToastProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
