import { twMerge } from 'tailwind-merge';
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Button, Checkbox, Input } from '@/components/ui';
import { useState } from 'react';
import {
  BookFiltersProps,
  FilterState,
} from '@/components/home/BookFilters/types';
import { statusOptions } from '@/lib/data/options';

const BookFilterDesktop = ({
  filters,
  onFiltersChange,
  onResetFilters,
}: BookFiltersProps) => {
  const [isExpended, setIsExpended] = useState<boolean>(false);
  const [tempMinPrice, setTempMinPrice] = useState<string>(
    filters.minPrice?.toString() || ''
  );
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(
    filters.maxPrice?.toString() || ''
  );

  const hasActiveFilters =
    filters.minPrice ||
    filters.maxPrice ||
    (filters.statusFilter && filters.statusFilter.length > 0);

  const handleFilterChange = (
    key: keyof FilterState,
    value?: string[] | number
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceApply = () => {
    const minValue = tempMinPrice === '' ? undefined : Number(tempMinPrice);
    const maxValue = tempMaxPrice === '' ? undefined : Number(tempMaxPrice);

    onFiltersChange({
      ...filters,
      minPrice: minValue,
      maxPrice: maxValue,
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
    if (onResetFilters) onResetFilters();
    setTempMinPrice('');
    setTempMaxPrice('');
  };

  return (
    <section className="my-5 hidden rounded-xl border border-gray-200 bg-white p-6 lg:block">
      <div
        className={twMerge(
          'flex items-center justify-between hover:cursor-pointer',
          (isExpended || hasActiveFilters) && 'mb-6'
        )}
        onClick={() => setIsExpended((prev) => !prev)}
      >
        <div className={'flex items-center gap-2'}>
          <AdjustmentsHorizontalIcon width={24} />
          <h2 className="text-lg font-semibold text-gray-900">필터</h2>
        </div>

        <Button variant={'line-none'} color={'gray'}>
          {isExpended ? (
            <ChevronDownIcon width={24} />
          ) : (
            <ChevronUpIcon width={24} />
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* 가격 필터 */}
        <div className={twMerge('space-y-3', !isExpended && 'hidden')}>
          <h3 className="text-sm font-medium text-gray-800">가격 범위</h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={9999}
                placeholder="최소"
                value={tempMinPrice}
                onChange={(e) => setTempMinPrice(e.target.value)}
                className="w-20 text-center"
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-400">~</span>
              </div>
              <Input
                type="number"
                min={1}
                max={9999}
                placeholder="최대"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(e.target.value)}
                className="w-20 text-center"
              />
              <span className="text-sm text-gray-500">원</span>
              <Button
                variant="fill"
                color="primary"
                size="sm"
                onClick={handlePriceApply}
                className="ml-2"
              >
                적용
              </Button>
            </div>
          </div>
        </div>

        {/* 상태 필터 */}
        <div className={twMerge('space-y-3', !isExpended && 'hidden')}>
          <h3 className="text-sm font-medium text-gray-800">책 상태</h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <Checkbox
                    label={option.label}
                    checked={
                      filters.statusFilter?.includes(option.value) || false
                    }
                    onChange={(checked) =>
                      handleStatusChange(option.value, checked)
                    }
                    color="primary"
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
};

export default BookFilterDesktop;
