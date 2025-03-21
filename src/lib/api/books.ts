import { BookSearchOutDto, BookSearchSort, CreateBookDto } from '@/types/books';
import { privateAxiosClient, publicAxiosClient } from '@/lib/api/axios.client';

const BOOKS = '/books';

// 책 목록 조회(검색)
export const searchBooksAPI = async (params: {
  search?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: BookSearchSort;
}): Promise<{ books: BookSearchOutDto[]; totalPages: number }> => {
  const response = await publicAxiosClient.get(`${BOOKS}/search`, { params });
  return response.data.data;
};

// 책 상세 조회
export const getBookDetailAPI = async (bookId: number) => {
  const response = await publicAxiosClient.get(`${BOOKS}/${bookId}`);
  return response.data.data;
};

// 책 등록
export const postNewBookAPI = async (newBook: CreateBookDto) => {
  const response = await privateAxiosClient.post(`${BOOKS}`, newBook);
  return response.data.data;
};
