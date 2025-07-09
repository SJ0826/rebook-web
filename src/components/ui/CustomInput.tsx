'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Field, Input, Label } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  className?: string;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      clearable = true,
      onClear,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [internalValue, setInternalValue] = useState<string>(
      (value as string) || ''
    );

    // ref 병합
    const handleRef = (el: HTMLInputElement) => {
      inputRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }
    };

    // 클리어 버튼 클릭
    const handleClear = () => {
      if (onClear) onClear();

      setInternalValue('');
      inputRef.current?.focus();
      // 부모 onChange 호출 (빈 값 전달)
      onChange?.({
        ...({
          target: inputRef.current,
          type: 'change',
        } as React.ChangeEvent<HTMLInputElement>),
      });
    };

    // 입력 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    // 외부 value prop 동기화
    useEffect(() => {
      setInternalValue((value as string) || '');
    }, [value]);

    return (
      <Field>
        <div className="flex w-full flex-wrap items-start">
          {label && (
            <Label
              htmlFor={props.id}
              className={twMerge(
                'mb-1 block min-w-20 text-base font-medium text-gray-700',
                hasError && 'text-red-600'
              )}
            >
              {label}
              {required && <span className="ml-0.5 text-red-500">*</span>}
            </Label>
          )}

          <div className="relative w-full">
            <Input
              ref={handleRef}
              className={twMerge(
                'text-md block w-full rounded-md border bg-white px-3 py-2 pr-10 shadow-sm transition-colors',
                'placeholder-gray-400 focus:outline-none',
                hasError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'focus:border-secondary-500 focus:ring-secondary-500 border-gray-300 focus:ring-1',
                className
              )}
              aria-invalid={hasError}
              aria-describedby={props.id ? `${props.id}-helper` : undefined}
              value={internalValue}
              onChange={handleChange}
              {...props}
            />

            {clearable && internalValue && !props.disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-1/2 right-2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-offset-1 focus:outline-none"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {helperText && !hasError && (
            <p id={`${props.id}-helper`} className="mt-1 text-xs text-gray-500">
              {helperText}
            </p>
          )}

          {hasError && (
            <p id={`${props.id}-helper`} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </Field>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
