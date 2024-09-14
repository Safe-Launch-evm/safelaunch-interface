import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  htmlFor?: string;
  helpertext?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, htmlFor, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-2">
        {label ? (
          <label htmlFor={htmlFor} className="text-[1.125rem]/[1.125rem]">
            {label}
          </label>
        ) : null}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-input px-3 py-2 text-[1.25rem] ring-offset-background placeholder:text-[#848E9C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {props.helpertext ? (
          <span className="absolute bottom-2 right-0 top-0 text-[1.125rem] text-muted">
            {props.helpertext}
          </span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
