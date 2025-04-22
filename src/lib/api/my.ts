import { privateAxiosClient } from './axios.client';
import {
  BookSaleStatus,
  BookSearchSort,
  BookStatus,
  SearchSellingBookResponse,
} from '@/types/books';

const MY = '/my';

export interface ProfileResponse {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  imageUrl: string;
}

type GetBookListParams = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: BookStatus;
  saleStatus?: BookSaleStatus;
  page?: number;
  limit?: number;
  sort?: BookSearchSort;
};

type UpdateProfileForm = {
  name?: string;
  imageUrl?: string;
};

//
// ──────────────────────────────────────────────────────────────
//   📌 프로필 관련 API
// ──────────────────────────────────────────────────────────────
//

/** 내 프로필 조회 */
export const getMyProfile = async (): Promise<ProfileResponse> => {
  const res = await privateAxiosClient.get(`${MY}/profile`);
  return res.data.data;
};

/** 내 프로필 수정 */
export const updateMyProfile = async (
  form: UpdateProfileForm
): Promise<ProfileResponse> => {
  const res = await privateAxiosClient.patch(`${MY}/profile`, form);
  return res.data.data;
};

//
// ──────────────────────────────────────────────────────────────
//   📚 책장 관련 API
// ──────────────────────────────────────────────────────────────
//

/** 판매중인 책 목록 조회 */
export const getSellingBooks = async (
  params: GetBookListParams
): Promise<SearchSellingBookResponse> => {
  const res = await privateAxiosClient.get(`${MY}/books/selling`, { params });
  return res.data.data;
};

/** 구매 요청한 책 목록 조회 */
export const getBuyingBooks = async (
  params: GetBookListParams
): Promise<SearchSellingBookResponse> => {
  const res = await privateAxiosClient.get(`${MY}/books/buying`, { params });
  return res.data.data;
};

/** 좋아요한 책 목록 조회 */
export const getFavoriteBooks = async (
  params: GetBookListParams
): Promise<SearchSellingBookResponse> => {
  const res = await privateAxiosClient.get(`${MY}/books/favorite`, { params });
  return res.data.data;
};
