// ---------------------------------------------
// 📌 공통 Enum 정의
// ---------------------------------------------

export enum BookStatus {
  NEW = 'NEW', // 새책
  LIKE_NEW = 'LIKE_NEW', // 거의 새책
  GOOD = 'GOOD', // 양호
  ACCEPTABLE = 'ACCEPTABLE', // 사용감 있음
}

export enum BookSaleStatus {
  FOR_SALE = 'FOR_SALE', // 판매 중
  SOLD = 'SOLD', // 거래 완료
}

export enum BookSearchSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_HIGH = 'price_high',
  PRICE_LOW = 'price_low',
}

// ---------------------------------------------
// 📌 검색 관련 타입
// ---------------------------------------------

export interface SearchParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sort?: BookSearchSort;
}

// ---------------------------------------------
// 📌 Book 관련 기본 모델
// ---------------------------------------------

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  status: BookStatus;
  imageUrls: string;
  createdAt: Date;
  updatedAt: Date;
  saleStatus: BookSaleStatus;
  requestCount: number;
  favoriteCount: number;
}

// ---------------------------------------------
// 📌 판매 중인 책 전용 모델 (거래요청 수, 판매 상태 포함)
// ---------------------------------------------

export interface SellingBook extends Book {
  saleStatus: BookSaleStatus;
  requestCount: number;
  favoriteCount: number;
}

// ---------------------------------------------
// 📌 책 상세 보기용 모델
// ---------------------------------------------

export interface BookDetail {
  id: bigint;
  title: string;
  author: string;
  publisher: string;
  price: number;
  description: string;
  status: BookStatus;
  createdAt: string;
  seller: {
    id: bigint;
    name: string;
  };
  bookImages: { uuid: string; imageUrl: string }[];
  requestCount: number;
  favoriteCount: number;
  isFavorite: boolean;
}

// ---------------------------------------------
// 📌 책 등록 DTO
// ---------------------------------------------

export interface CreateBookDto {
  title: string;
  author: string;
  imageUuids: { uuid: string; sort: number }[];
  publisher: string;
  price: number;
  status: BookStatus;
  description?: string;
}

// ---------------------------------------------
// 📌 응답 모델 (검색 결과)
// ---------------------------------------------

export interface SearchBookResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  books: Book[];
}

export interface SearchSellingBookResponse extends SearchBookResponse {
  books: SellingBook[];
}
