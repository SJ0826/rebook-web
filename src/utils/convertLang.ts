import { BookStatus } from '@/types/books';

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
