export interface SearchParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string; // 예: 'Available', 'Sold Out'
}

export enum BookStatus {
  NEW = 'NEW', // 새책
  LIKE_NEW = 'LIKE_NEW', // 거의 새책
  GOOD = 'GOOD', // 양호
  ACCEPTABLE = 'ACCEPTABLE', // 사용감 있음
}

export interface BookSearchOutDto {
  id: string;
  title: string;
  author: string;
  price: number;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
  // 책의 대표 이미지 URL: bookImage에서 sort가 0인 항목의 imageUrl
  imageUrls?: string;
}
