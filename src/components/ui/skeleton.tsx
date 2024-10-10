'use client';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-card-foreground/70', className)}
      {...props}
    />
  );
}

export { Skeleton };
