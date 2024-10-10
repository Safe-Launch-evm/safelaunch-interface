import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-[1.25rem]/[1.75rem] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-[#030208] hover:bg-primary/90 hover:text-[#030208]/90 hover:shadow-btn',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border bg-transparent text-muted hover:border-primary hover:text-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'border border-transparent hover:border-primary hover:bg-card hover:text-primary',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'px-3 py-2 text-[1rem] lg:text-[1.25rem]/[1.75rem]',
        sm: 'h-9 rounded-md px-3 text-[1.25rem]',
        tab: 'h-6 rounded p-2 font-inter text-[1rem] font-medium lg:h-[36px] lg:p-3',
        lg: 'rounded-lg p-3',
        icon: 'size-10'
      },
      fullWidth: {
        true: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, fullWidth, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
