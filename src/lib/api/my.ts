import { privateAxiosClient } from './axios.client';
import { ApiResponse } from '@/types/commons';
import {
  BookSaleStatus,
  BookSearchSort,
  BookStatus,
  SearchBookResponse,
  SearchSellingBookResponse,
} from '@/types/books';

const MY = '/my';

// 내 프로필 조회
export const getMyProfile = async () => {
  const response = await privateAxiosClient.get(`${MY}/profile`);

  return response.data.data;
};

// 판매중인 책 목록 조회
export const getSellingBooks = async (params: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: BookStatus;
  saleStatus?: BookSaleStatus;
  page?: number;
  limit?: number;
  sort?: BookSearchSort;
}): Promise<SearchSellingBookResponse> => {
  const response = await privateAxiosClient.get(`${MY}/books/selling`, {
    params,
  });
  return response.data.data;
};
