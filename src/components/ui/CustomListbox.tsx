import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

interface Option {
  value: string;
  label: string;
}

interface CustomListboxProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export default function CustomListbox({
  value,
  onChange,
  options,
  placeholder = '선택해주세요',
  disabled = false,
  className = '',
  error = false,
}: CustomListboxProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            className={`relative w-full cursor-pointer rounded-lg border bg-white py-3 pr-10 pl-4 text-left transition-colors focus:ring-1 focus:outline-none ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'focus:border-secondary-500 focus:ring-secondary-500 border-gray-300'
            } ${
              disabled
                ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                : 'hover:border-gray-400'
            } `}
          >
            <span className="block truncate text-gray-900">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className="group data-focus:bg-secondary-100 data-focus:text-secondary-900 relative cursor-pointer py-3 pr-10 pl-4 text-gray-900 select-none hover:bg-gray-50"
              >
                <span className="block truncate font-medium group-data-selected:font-semibold">
                  {option.label}
                </span>
                <span className="text-secondary-600 absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-data-selected:opacity-100">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
