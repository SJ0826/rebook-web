import { NextRequest, NextResponse } from 'next/server';
import { noAuthRoutes } from '@/lib/data/noAuthRoutes';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요없는 경로는 패스
  if (noAuthRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;

  // 토큰 없음 -> 로그인 페이지로 리다이렉트
  // if (!refreshToken) {
  //   return NextResponse.redirect(new URL(ROUTES.LOGIN, request.nextUrl.origin));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (all Next.js internal files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - static files with extensions
     * - .well-known (for various web standards)
     */
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|\\.well-known|.*\\..*).*)',
  ],
};
