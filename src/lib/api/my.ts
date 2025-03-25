import { privateAxiosClient } from './axios.client';
import {
  BookSaleStatus,
  BookSearchSort,
  BookStatus,
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

// 구매요청 한 책 목록 조회
export const getBuyingBooks = async (params: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: BookStatus;
  saleStatus?: BookSaleStatus;
  page?: number;
  limit?: number;
  sort?: BookSearchSort;
}): Promise<SearchSellingBookResponse> => {
  const response = await privateAxiosClient.get(`${MY}/books/buying`, {
    params,
  });
  return response.data.data;
};

// 관심 책장 (좋아요) 책 목록 조회
export const getFavoriteBooks = async (params: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: BookStatus;
  saleStatus?: BookSaleStatus;
  page?: number;
  limit?: number;
  sort?: BookSearchSort;
}): Promise<SearchSellingBookResponse> => {
  const response = await privateAxiosClient.get(`${MY}/books/favorite`, {
    params,
  });
  return response.data.data;
};
