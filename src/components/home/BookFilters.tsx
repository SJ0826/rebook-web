import { BookSearchSort } from '@/types/books';

export interface FilterState {
  searchTerm: string;
  minPrice?: number;
  maxPrice?: number;
  statusFilter?: string;
  sortOption: BookSearchSort;
}

interface BookFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const BookFilters = ({ filters, onFiltersChange }: BookFiltersProps) => {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <section className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4">
      {/* 가격 필터 */}
      {/*<select*/}
      {/*  value={filters.priceFilter}*/}
      {/*  onChange={(e) => handleFilterChange('priceFilter', e.target.value)}*/}
      {/*  className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"*/}
      {/*>*/}
      {/*  <option value="">전체 가격</option>*/}
      {/*  <option value="low">8,000원 이하</option>*/}
      {/*  <option value="mid">8,000원 ~ 10,000원</option>*/}
      {/*  <option value="high">10,000원 이상</option>*/}
      {/*</select>*/}

      {/* 상태 필터 */}
      <select
        value={filters.statusFilter}
        onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">전체 상태</option>
        <option value="NEW">새 상품</option>
        <option value="LIKE_NEW">거의 새 상품</option>
        <option value="GOOD">양호</option>
        <option value="ACCEPTABLE">사용 가능</option>
      </select>
    </section>
  );
};

export default BookFilters;
