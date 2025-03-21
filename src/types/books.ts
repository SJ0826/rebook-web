export interface SearchParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sort?: BookSearchSort;
}

export enum BookStatus {
  NEW = 'NEW', // 새책
  LIKE_NEW = 'LIKE_NEW', // 거의 새책
  GOOD = 'GOOD', // 양호
  ACCEPTABLE = 'ACCEPTABLE', // 사용감 있음
}

export enum BookSearchSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_HIGH = 'price_high',
  PRICE_LOW = 'price_low',
}
export interface BookSearchOutDto {
  id: string;
  title: string;
  author: string;
  price: number;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
  imageUrls?: string;
}

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
  bookImages: string[];
}

export interface CreateBookDto {
  title: string;
  author: string;
  imageUuids: { uuid: string; sort: number }[];
  publisher: string;
  price: number;
  status: BookStatus;
  description?: string;
}
