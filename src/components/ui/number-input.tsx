'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  onEnter?: () => void;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ 
    className, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    step = 0.1, 
    suffix,
    prefix,
    onEnter,
    onKeyDown,
    ...props 
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // 빈 값이거나 유효하지 않은 경우 처리
      if (inputValue === '' || inputValue === '-') {
        return;
      }
      
      const numValue = parseFloat(inputValue);
      
      // NaN 체크
      if (isNaN(numValue)) {
        return;
      }
      
      // 범위 제한
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onChange(clampedValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // 엔터키 처리
      if (e.key === 'Enter' && onEnter) {
        onEnter();
      }
      
      // 화살표 키로 값 조정
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newValue = Math.min(value + step, max);
        onChange(newValue);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newValue = Math.max(value - step, min);
        onChange(newValue);
      }
      
      onKeyDown?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // 블러 시 값 정리
      const numValue = parseFloat(e.target.value);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(numValue, min), max);
        onChange(clampedValue);
      }
    };

    return (
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          type="number"
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            prefix && "pl-8",
            suffix && "pr-8",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };