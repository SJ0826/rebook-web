import {
  Book,
  BookDetail,
  BookSaleStatus,
  BookSearchSort,
  CreateBookDto,
} from '@/types/books';
import { privateAxiosClient, publicAxiosClient } from '@/lib/api/axios.client';

const BOOKS = '/books';

// 책 목록 조회(검색)
export const getSearchBooks = async (params: {
  search?: string;
  status?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: BookSearchSort;
}): Promise<{ books: Book[]; totalPages: number; totalCount: number }> => {
  const { status, ...otherParams } = params;

  const queryParams = new URLSearchParams();

  Object.entries(otherParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  if (status && status.length > 0) {
    status.forEach((value) => queryParams.append('status', value));
  }

  const response = await publicAxiosClient.get(
    `${BOOKS}/search?${queryParams.toString()}`
  );
  return response.data.data;
};

// 책 상세 조회
export const getBookDetailAPI = async (bookId: number): Promise<BookDetail> => {
  const response = await privateAxiosClient.get(`${BOOKS}/${bookId}`, {});
  return response.data.data;
};

// 책 등록
export const postNewBookAPI = async (newBook: CreateBookDto) => {
  const response = await privateAxiosClient.post(`${BOOKS}`, newBook);
  return response.data.data;
};

// 책 삭제
export const deleteBookAPI = async (bookId: number) => {
  const response = await privateAxiosClient.delete(`${BOOKS}/${bookId}`);
  return response.data.data;
};

// 책 수정
export const updateBookAPI = async (
  bookId: number,
  bookForm: CreateBookDto
) => {
  const response = await privateAxiosClient.patch(
    `${BOOKS}/${bookId}`,
    bookForm
  );
  return response.data.data;
};

// 책 판매 상태 수정
export const updateBookSaleStatusAPI = async (
  bookId: number,
  saleStatus: BookSaleStatus
) => {
  const response = await privateAxiosClient.patch(
    `${BOOKS}/${bookId}/sale-status`,
    { saleStatus }
  );
  return response.data.data;
};
