'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@headlessui/react';

type Variant = 'fill' | 'line' | 'line-sub' | 'line-none';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'fill', size = 'md', className, ...props }, ref) => {
    const baseStyle =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-2.5 text-lg',
    };

    const variantStyles = {
      fill: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      line: 'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      'line-sub':
        'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
      'line-none':
        'bg-transparent text-gray-600 hover:underline focus:ring-gray-200',
    };

    const merged = twMerge(
      baseStyle,
      sizeStyles[size],
      variantStyles[variant],
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
