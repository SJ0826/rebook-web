import { BookSearchSort } from '@/types/books';

export interface FilterState {
  searchTerm: string;
  minPrice?: number;
  maxPrice?: number;
  statusFilter?: string[];
  sortOption: BookSearchSort;
}

export interface BookFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onResetFilters: () => void;
}
