import BookFilterDesktop from '@/app/(main)/(home)/_components/BookFilters/BookFilter.desktop';
import BookFilterMobile from '@/app/(main)/(home)/_components/BookFilters/BookFilter.mobile';
import { BookFiltersProps } from '@/app/(main)/(home)/_types';

const BookFilters = ({ filters, onFiltersChange }: BookFiltersProps) => {
  const handleReset = () => {
    onFiltersChange({
      searchTerm: '',
      minPrice: undefined,
      maxPrice: undefined,
      statusFilter: undefined,
      sortOption: filters.sortOption, // 정렬은 유지
    });
  };

  return (
    <>
      {/* 데스크톱 필터 */}
      <BookFilterDesktop
        filters={filters}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleReset}
      />

      {/*  모바일 필터 */}
      <BookFilterMobile
        filters={filters}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleReset}
      />
    </>
  );
};

export default BookFilters;
