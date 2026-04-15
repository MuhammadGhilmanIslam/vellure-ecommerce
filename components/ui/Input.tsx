'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, required, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasValue = value !== undefined && value !== '' || (props.defaultValue !== undefined && props.defaultValue !== '');

    return (
      <div className="relative w-full mb-4">
        <label
          className={cn(
            'absolute left-0 transition-all duration-300 pointer-events-none text-ag-text-2',
            isFocused || hasValue ? '-top-3.5 text-xs text-ag-accent' : 'top-2 text-base',
            error && 'text-ag-error'
          )}
        >
          {label} {required && <span className="text-ag-error">*</span>}
        </label>
        <div className="relative">
          <input
            {...props}
            type={inputType}
            ref={ref}
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              // Only remove focus if there's no value. Wait, the hasValue logic works based on value prop or uncontrolled internal.
              // To handle uncontrolled inputs gracefully with floating labels, it's better to check target.value.
              if (!e.target.value) {
                 setIsFocused(false);
              }
              props.onBlur?.(e);
            }}
            onChange={(e) => {
               // Update parent, and logic for floating label handles value via props if controlled.
               if (e.target.value) setIsFocused(true);
               props.onChange?.(e);
            }}
            className={cn(
              'flex w-full bg-transparent py-2 text-sm text-ag-text placeholder:text-transparent transition-colors focus:placeholder:text-ag-text-2 focus-visible:outline-none border-b border-ag-border border-t-0 border-l-0 border-r-0 rounded-none px-0 focus:border-ag-accent',
              error && 'border-ag-error focus:border-ag-error',
              isPassword && 'pr-10',
              className
            )}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-ag-text-2 hover:text-ag-text transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-ag-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
