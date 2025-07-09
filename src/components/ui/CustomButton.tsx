'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@headlessui/react';

type Variant = 'fill' | 'line' | 'line-sub' | 'line-none';
type Size = 'sm' | 'md' | 'lg';
type Color = 'primary' | 'secondary' | 'green' | 'red' | 'gray';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  color?: Color;
  className?: string;
}

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'fill', size = 'md', color = 'primary', className, ...props },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-0 disabled:opacity-50 disabled:pointer-events-none';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-2.5 text-lg',
    };

    const colorStyles = {
      primary: {
        fill: 'bg-primary-500 text-white hover:bg-primary-600 ',
        line: 'border border-primary-500 text-primary-500 hover:bg-primary-50 ',
        'line-sub':
          'border border-primary-300 text-primary-700 hover:bg-primary-50 ',
        'line-none': 'bg-transparent text-primary-600 hover:underline',
      },
      secondary: {
        fill: 'bg-secondary-500 text-white hover:bg-secondary-600 ',
        line: 'border border-secondary-500 text-secondary-500 hover:bg-secondary-50 ',
        'line-sub':
          'border border-secondary-300 text-secondary-700 hover:bg-secondary-50 ',
        'line-none': 'bg-transparent text-secondary-600 hover:underline ',
      },
      green: {
        fill: 'bg-green-500 text-white hover:bg-green-600',
        line: 'border border-green-500 text-green-500 hover:bg-green-50 ',
        'line-sub': 'border border-green-300 text-green-700 hover:bg-green-50 ',
        'line-none': 'bg-transparent text-green-600 hover:underline ',
      },
      red: {
        fill: 'bg-red-500 text-white hover:bg-red-600',
        line: 'border border-red-500 text-red-500 hover:bg-red-50',
        'line-sub': 'border border-red-300 text-red-700 hover:bg-red-50',
        'line-none': 'bg-transparent text-red-600 hover:underline',
      },
      gray: {
        fill: 'bg-gray-500 text-white hover:bg-gray-600',
        line: 'border border-gray-500 text-gray-500 hover:bg-gray-50',
        'line-sub': 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        'line-none': 'bg-transparent text-gray-600 hover:underline',
      },
    };

    const merged = twMerge(
      baseStyle,
      sizeStyles[size],
      colorStyles[color][variant],
      className
    );

    return (
      <Button ref={ref} className={merged} {...props}>
        {props.children}
      </Button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
