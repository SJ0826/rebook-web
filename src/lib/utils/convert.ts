import { BookSaleStatus, BookStatus } from '@/types/books';

// 책 상태 변환
export const convertBookStatus = (status: BookStatus) => {
  switch (status) {
    case BookStatus.NEW:
      return '새책';
    case BookStatus.LIKE_NEW:
      return '거의 새책';
    case BookStatus.GOOD:
      return '양호';
    case BookStatus.ACCEPTABLE:
      return '사용감 있음';
  }
};

// 책 판매 상태 변환
export const convertBookSaleStatus = (status: BookSaleStatus) => {
  switch (status) {
    case 'FOR_SALE':
      return '판매중';
    case 'SOLD':
      return '판매 완료';
  }
};
