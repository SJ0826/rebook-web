import { Button } from '@/components/ui';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { statusOptions } from '@/lib/data/options';
import {
  BookFiltersProps,
  FilterState,
} from '@/components/home/BookFilters/types';
import MobileFilterModal from '@/components/home/MobileFilterModal';

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
      <div className={'block lg:hidden'}>
        {/* 버튼 */}
        <div className={'flex items-center justify-between gap-4'}>
          <Button
            onClick={() => setIsOpenFilterModal((prev) => !prev)}
            size={'sm'}
            variant={'line-none'}
            color={'gray'}
            className={'flex w-fit items-center gap-2 text-xs'}
          >
            <AdjustmentsHorizontalIcon width={14} height={14} />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="line-none"
              color="gray"
              size="sm"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-700 lg:text-sm"
            >
              초기화
            </Button>
          )}
        </div>

        {/* 활성 필터 표시 */}
        {hasActiveFilters && (
          <div className="pt-4">
            <div className="scrollbar-hide flex w-screen gap-2 overflow-x-auto pb-2">
              {filters.minPrice && (
                <span className="bg-primary-100 text-primary-700 flex items-center gap-1 rounded-full px-2 py-1 text-xs whitespace-nowrap">
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
                <span className="bg-primary-100 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs whitespace-nowrap">
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
                    className="bg-primary-100 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs whitespace-nowrap"
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
            </div>
            <div className="w-4 flex-shrink-0"></div>
          </div>
        )}
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
