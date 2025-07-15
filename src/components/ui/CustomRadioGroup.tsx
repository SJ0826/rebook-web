import { Radio, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomRadioGroupProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  disabled?: boolean;
}

export default function CustomRadioGroup({
  label,
  value,
  onChange,
  options,
  className = '',
  disabled = false,
}: CustomRadioGroupProps) {
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  return (
    <div className={className}>
      {label && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        </div>
      )}
      <RadioGroup
        by="value"
        value={selectedOption}
        onChange={(option) => onChange(option.value)}
        disabled={disabled}
        className="space-y-2"
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option}
            className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50 focus:not-data-focus:outline-none data-checked:border-blue-200 data-checked:bg-blue-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-white data-focus:outline data-focus:outline-2 data-focus:outline-blue-500"
          >
            <div className="flex w-full items-center justify-between">
              <div className="text-sm">
                <p className="font-medium text-gray-900 group-data-checked:text-blue-900">
                  {option.label}
                </p>
                {option.description && (
                  <p className="text-gray-500 group-data-checked:text-blue-700">
                    {option.description}
                  </p>
                )}
              </div>
              <CheckCircleIcon className="size-5 fill-blue-600 opacity-0 transition group-data-checked:opacity-100" />
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
