'use client';

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, accessToken } = useAuth();
  console.log(isAuthenticated, accessToken);
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold">홈 화면</h2>
      <p className="text-gray-600 mt-2">모바일 웹앱 기본 레이아웃</p>
      <button className="btn btn-primary">Button</button>
    </div>
  );
}
