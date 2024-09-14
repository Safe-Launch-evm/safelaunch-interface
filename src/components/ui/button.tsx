import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap gap-2 border rounded-lg text-[1.5rem] font-bold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary hover:bg-primary/90 hover:shadow-dip',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border bg-transparent text-muted hover:text-primary hover:border-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-card border border-transparent hover:border-primary hover:text-primary',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'p-3 h-[37px] lg:h-[53px] text-[1rem] lg:text-[1.5rem]',
        sm: 'h-9 rounded-md px-3 text-[1.25rem]',
        tab: 'lg:h-[36px] h-6 p-2 lg:p-3 font-medium font-inter text-[1rem] rounded',
        lg: 'p-3 rounded-lg',
        icon: 'h-10 w-10'
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
