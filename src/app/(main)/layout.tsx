import Layout from '@/components/layout/Layout';

// 레이아웃
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
