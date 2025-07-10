import { BookSearchSort } from '@/types/books';
import BookFilterDesktop from '@/components/home/BookFilters/BookFilter.desktop';
import BookFilterMobile from '@/components/home/BookFilters/BookFilter.mobile';

export interface FilterState {
  searchTerm: string;
  minPrice?: number;
  maxPrice?: number;
  statusFilter?: string[];
  sortOption: BookSearchSort;
}

interface BookFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

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
      <BookFilterMobile filters={filters} onFiltersChange={onFiltersChange} />
    </>
  );
};

export default BookFilters;
