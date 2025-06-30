import { NextRequest, NextResponse } from 'next/server';
import { noAuthRoutes } from '@/lib/data/noAuthRoutes';
import { ROUTES } from '@/lib/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요없는 경로는 패스
  if (noAuthRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;

  // 토큰 없음 -> 로그인 페이지로 리다이렉트
  if (!refreshToken) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN));
  }

  return NextResponse.next();
}
