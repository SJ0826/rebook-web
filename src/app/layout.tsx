import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ko">
      <body className="min-h-screen flex flex-col bg-gray-100">
      {/* 상단 네비게이션 */}
      <header className="fixed top-0 w-full bg-white shadow-md py-3 px-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">MyApp</h1>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 mt-14 mb-16 p-4">{children}</main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 w-full bg-white shadow-t-md py-3 flex justify-around border-t">
          <button className="flex flex-col items-center">
              <span className="text-sm">홈</span>
          </button>
          <button className="flex flex-col items-center">
              <span className="text-sm">검색</span>
          </button>
          <button className="flex flex-col items-center">
              <span className="text-sm">프로필</span>
          </button>
      </nav>
      </body>
      </html>
  );
}
