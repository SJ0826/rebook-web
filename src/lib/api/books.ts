import { BookSearchOutDto, BookSearchSort } from '@/types/books';
// 예시: src/lib/api/books.ts
import { publicAxiosClient } from '@/lib/api/axios.client';

const BOOKS = '/books';

export const searchBooksAPI = async (params: {
  search?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: BookSearchSort;
}): Promise<BookSearchOutDto[]> => {
  const response = await publicAxiosClient.get(`${BOOKS}/search`, { params });
  return response.data.data;
};
