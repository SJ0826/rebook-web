'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Checkbox, Input } from '@/components/ui';
import { FilterState } from '@/components/home/BookFilters/types';

const MobileFilterModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: filters.searchTerm,
      sortOption: filters.sortOption,
      minPrice: undefined,
      maxPrice: undefined,
      statusFilter: undefined,
    };
    setTempFilters(resetFilters);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* 바텀 시트 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 bottom-0 left-0 z-50 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white"
          >
            {/* 헤더 */}
            <div className="sticky top-0 rounded-t-2xl border-b border-gray-200 bg-white px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">필터</h2>
                <Button
                  onClick={onClose}
                  className="p-2 text-black"
                  variant={'line-none'}
                >
                  <XMarkIcon className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* 필터 내용 */}
            <div className="space-y-6 p-4">
              {/* 가격 범위 */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-800">
                  가격 범위
                </h3>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    placeholder="최소"
                    className={'flex-1'}
                    value={tempFilters.minPrice || ''}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        minPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <span className="text-gray-400">~</span>
                  <Input
                    type="number"
                    placeholder="최대"
                    className={'flex-1'}
                    value={tempFilters.maxPrice || ''}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <span className="text-sm text-gray-500">원</span>
                </div>
              </div>

              {/* 책 상태 */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-800">
                  책 상태
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'NEW', label: '새책' },
                    { value: 'LIKE_NEW', label: '거의 새책' },
                    { value: 'GOOD', label: '양호' },
                    { value: 'ACCEPTABLE', label: '사용감 있음' },
                  ].map((option) => (
                    <Checkbox
                      key={option.value}
                      label={option.label}
                      checked={
                        tempFilters.statusFilter?.includes(option.value) ||
                        false
                      }
                      onChange={(checked) => {
                        const current = tempFilters.statusFilter || [];
                        const updated = checked
                          ? [...current, option.value]
                          : current.filter((s) => s !== option.value);
                        setTempFilters({
                          ...tempFilters,
                          statusFilter:
                            updated.length > 0 ? updated : undefined,
                        });
                      }}
                      size={'sm'}
                      color={'secondary'}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant={'line-sub'}
                  className={'flex-1'}
                  color={'gray'}
                >
                  초기화
                </Button>
                <Button onClick={handleApply} className={'flex-1'}>
                  적용하기
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterModal;
