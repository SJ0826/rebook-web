import React from 'react';
import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'green' | 'red';
  description?: string;
  className?: string;
}

// 단일 체크박스 컴포넌트
export const CustomCheckbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  color = 'primary',
  description,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const colorClasses = {
    primary: {
      checked: 'bg-primary-500 border-primary-500',
      unchecked: 'bg-white border-gray-300',
      hover: 'hover:border-primary-400',
      disabled: 'disabled:bg-gray-100 disabled:border-gray-200',
    },
    secondary: {
      checked: 'bg-secondary-500 border-secondary-500',
      unchecked: 'bg-white border-gray-300',
      hover: 'hover:border-secondary-400',
      disabled: 'disabled:bg-gray-100 disabled:border-gray-200',
    },
    green: {
      checked: 'bg-green-500 border-green-500',
      unchecked: 'bg-white border-gray-300',
      hover: 'hover:border-green-400',
      disabled: 'disabled:bg-gray-100 disabled:border-gray-200',
    },
    red: {
      checked: 'bg-red-500 border-red-500',
      unchecked: 'bg-white border-gray-300',
      hover: 'hover:border-red-400',
      disabled: 'disabled:bg-gray-100 disabled:border-gray-200',
    },
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Checkbox
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`flex items-center justify-center ${sizeClasses[size]} ${checked ? colorClasses[color].checked : colorClasses[color].unchecked} ${!disabled ? colorClasses[color].hover : ''} ${!disabled ? '' : colorClasses[color].disabled} rounded-md border-2 transition-colors duration-200 focus:ring-0 focus:outline-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
      >
        {checked && (
          <CheckIcon
            className={`${iconSizeClasses[size]} stroke-2 text-white`}
          />
        )}
      </Checkbox>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              className={` ${textSizeClasses[size]} font-medium text-gray-900 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
              onClick={() => !disabled && onChange(!checked)}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={`text-sm text-gray-500 ${disabled ? 'opacity-50' : ''}`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCheckbox;
