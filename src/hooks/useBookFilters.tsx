import { BookSearchSort } from '@/types/books';
import { useState } from 'react';
import { FilterState } from '@/components/home/BookFilters';

const useBookFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '', // 실제로는 사용하지 않음 (헤더에서 관리)
    minPrice: undefined,
    maxPrice: undefined,
    statusFilter: undefined,
    sortOption: BookSearchSort.NEWEST,
  });

  const updateFilter = (key: string, value?: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      minPrice: undefined,
      maxPrice: undefined,
      statusFilter: undefined,
      sortOption: BookSearchSort.NEWEST,
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
};

export default useBookFilters;
