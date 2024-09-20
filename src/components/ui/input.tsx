import * as React from 'react';

import { cn } from '@/lib/utils';
import { FieldError } from '../field-error';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  htmlFor?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, htmlFor, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label htmlFor={htmlFor} className="text-[1.125rem]/[1.125rem]">
            {label}
          </label>
        ) : null}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-lg border bg-input px-4 py-3 font-inter text-[1.25rem] font-normal text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#848E9C] disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        <FieldError name={props.name as string} />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
