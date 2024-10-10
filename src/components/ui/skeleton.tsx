'use client';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-foreground/[0.20]', className)}
      {...props}
    />
  );
}

export { Skeleton };
