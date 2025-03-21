import { privateAxiosClient } from '@/lib/api/axios.client';

const FAVORITES = '/favorites';

// 좋아요 (내 책장) 추가
export const createFavoriteAPI = async (bookId: string) => {
  const response = await privateAxiosClient.post(FAVORITES, { bookId });
  return response.data.data;
};

// 좋아요 (내 책장) 제거
export const deleteFavoriteAPI = async (bookId: string) => {
  const response = await privateAxiosClient.delete(`${FAVORITES}/${bookId}`);
  return response.data.data;
};
