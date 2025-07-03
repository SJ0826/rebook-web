'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Field, Input, Label } from '@headlessui/react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <Field>
        <div className="flex w-full flex-wrap items-center">
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

          <Input
            ref={ref}
            className={twMerge(
              'text-md block w-full rounded-md border bg-white px-3 py-2 shadow-sm transition-colors',
              'placeholder-gray-400 focus:outline-none',
              hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'focus:border-secondary-500 focus:ring-secondary-500 border-gray-300 focus:ring-1',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={props.id ? `${props.id}-helper` : undefined}
            {...props}
          />

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
