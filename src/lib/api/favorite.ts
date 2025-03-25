import { privateAxiosClient } from '@/lib/api/axios.client';

const FAVORITES = '/favorites';

// 좋아요 (나의 서재) 추가
export const createFavoriteAPI = async (bookId: bigint) => {
  const response = await privateAxiosClient.post(FAVORITES, { bookId });
  return response.data.data;
};

// 좋아요 (나의 서재) 제거
export const deleteFavoriteAPI = async (bookId: bigint) => {
  const response = await privateAxiosClient.delete(`${FAVORITES}/${bookId}`);
  return response.data.data;
};
