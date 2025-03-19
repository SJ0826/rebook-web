'use server';

import { cookies } from 'next/headers';

export async function getRefreshTokenInServer(): Promise<boolean> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken');
  return !!refreshToken?.value;
}
