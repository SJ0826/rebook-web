import { BookSearchSort } from '@/types/books';
import { Button } from '@/components/ui';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import MobileFilterModal from '@/components/book/MobileFilterModal';
import { useState } from 'react';
import { statusOptions } from '@/lib/data/options';

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

const BookFilterMobile = ({ filters, onFiltersChange }: BookFiltersProps) => {
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
  const [tempMinPrice, setTempMinPrice] = useState<string>(
    filters.minPrice?.toString() || ''
  );
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(
    filters.maxPrice?.toString() || ''
  );

  const handleFilterChange = (
    key: keyof FilterState,
    value?: string[] | number
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = filters.statusFilter || [];
    let newStatuses;

    if (checked) {
      newStatuses = [...currentStatuses, status];
    } else {
      newStatuses = currentStatuses.filter((s) => s !== status);
    }

    handleFilterChange(
      'statusFilter',
      newStatuses.length > 0 ? newStatuses : undefined
    );
  };

  const handleReset = () => {
    setTempMinPrice('');
    setTempMaxPrice('');
    onFiltersChange({
      searchTerm: '',
      minPrice: undefined,
      maxPrice: undefined,
      statusFilter: undefined,
      sortOption: filters.sortOption, // 정렬은 유지
    });
  };

  const hasActiveFilters =
    filters.minPrice ||
    filters.maxPrice ||
    (filters.statusFilter && filters.statusFilter.length > 0);
  return (
    <>
      {' '}
      <div className={'lg:hidden'}>
        {/* 활성 필터 표시 */}
        {hasActiveFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="relative flex flex-wrap gap-2">
              {filters.minPrice && (
                <span className="bg-primary-100 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                  최소: {filters.minPrice}원
                  <button
                    onClick={() => {
                      setTempMinPrice('');
                      handleFilterChange('minPrice', undefined);
                    }}
                    className="hover:text-primary-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.maxPrice && (
                <span className="bg-primary-100 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                  최대: {filters.maxPrice}원
                  <button
                    onClick={() => {
                      setTempMaxPrice('');
                      handleFilterChange('maxPrice', undefined);
                    }}
                    className="hover:text-primary-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.statusFilter?.map((status) => {
                const option = statusOptions.find(
                  (opt) => opt.value === status
                );
                return (
                  <span
                    key={status}
                    className="bg-primary-100 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs"
                  >
                    {option?.label}
                    <button
                      onClick={() => handleStatusChange(status, false)}
                      className="hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {hasActiveFilters && (
                <Button
                  variant="line-none"
                  color="gray"
                  size="sm"
                  onClick={handleReset}
                  className="absolute right-0 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </Button>
              )}
            </div>
          </div>
        )}
        <Button
          onClick={() => setIsOpenFilterModal((prev) => !prev)}
          size={'sm'}
          variant={'line-none'}
          color={'gray'}
          className={'flex w-fit items-center gap-2 text-xs'}
        >
          <AdjustmentsHorizontalIcon width={14} height={14} />
        </Button>
      </div>
      {isOpenFilterModal && (
        <MobileFilterModal
          filters={filters}
          onFiltersChange={onFiltersChange}
          isOpen={isOpenFilterModal}
          onClose={() => setIsOpenFilterModal(false)}
        />
      )}
    </>
  );
};

export default BookFilterMobile;
