import { BookSaleStatus, BookSearchSort, BookStatus } from '@/types/books';

export const priceOption = [
  { value: '', label: '전체 가격' },

  {
    value: 'low',
    label: '저가 (8,000원 미만)',
  },
  {
    value: 'mid',
    label: '중간가 (8,000원 ~ 10,000원)',
  },
  {
    value: 'high',
    label: '고가 (10,000원 초과)',
  },
];

export const statusOptions = [
  { value: '', label: '전체 상태' },
  { value: BookStatus.NEW, label: '새책' },
  { value: BookStatus.LIKE_NEW, label: '거의 새책' },
  { value: BookStatus.GOOD, label: '양호' },
  { value: BookStatus.ACCEPTABLE, label: '사용감 있음' },
];

export const saleStatusOptions = [
  { value: '', label: '전체 판매 상태' },
  { value: BookSaleStatus.FOR_SALE, label: '판매중' },
  { value: BookSaleStatus.SOLD, label: '판매 완료' },
];

export const sortOptions = [
  { value: BookSearchSort.NEWEST, label: '최신순' },
  { value: BookSearchSort.PRICE_HIGH, label: '높은 가격 순' },
  { value: BookSearchSort.PRICE_LOW, label: '낮은 가격 순' },
  { value: BookSearchSort.OLDEST, label: '오래된 순' },
];
