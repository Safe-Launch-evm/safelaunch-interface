import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const shellVariants = cva('grid gap-6', {
  variants: {
    variant: {
      default:
        'container mx-auto w-full max-w-screen-2xl gap-10 lg:gap-[67px] py-[100px] px-4 lg:px-[67px]',
      center:
        'flex justify-center items-center gap-10 flex-col container mx-auto w-full max-w-screen-2xl px-4 py-[100px] lg:px-[67px] lg:py-[150px]'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({ className, as: Comp = 'div', variant, ...props }: ShellProps) {
  return <Comp className={cn(shellVariants({ variant }), className)} {...props} />;
}

export { Shell, shellVariants };
