import { BookSearchSort } from '@/types/books';

const SortControl = ({
  sortOption,
  onSortChange,
}: {
  sortOption: BookSearchSort;
  onSortChange: (sort: BookSearchSort) => void;
}) => {
  const sortOptions = [
    { value: BookSearchSort.NEWEST, label: '최신순' },
    { value: BookSearchSort.OLDEST, label: '오래된순' },
    { value: BookSearchSort.PRICE_LOW, label: '낮은가격순' },
    { value: BookSearchSort.PRICE_HIGH, label: '높은가격순' },
  ];

  return (
    <div className="flex items-center p-1">
      {sortOptions.map((option, index) => (
        <>
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`rounded-md px-2 py-2 text-[13px] font-medium transition-all duration-200 ${
              sortOption === option.value
                ? 'bg-white text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {option.label}
          </button>
          {index < sortOptions.length - 1 && (
            <div className="mx-1 h-[12px] w-[1px] bg-gray-300" />
          )}
        </>
      ))}
    </div>
  );
};

export default SortControl;
