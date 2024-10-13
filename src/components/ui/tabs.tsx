'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const tabListVariants = cva('', {
  variants: {
    variant: {
      default: 'inline-flex items-center justify-start',
      pill: 'flex w-full items-center justify-center rounded-lg border',
      secondary:
        'flex items-center justify-center gap-4 rounded-lg border border-card-foreground bg-card p-2',
      centered: 'flex w-full items-center justify-between'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

interface TabListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabListProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabListVariants({ variant }), className)}
      {...props}
    />
  )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const tabTriggerVariants = cva('disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      default:
        'flex items-start justify-center border-b border-card  p-3 font-inter text-[1rem] text-muted data-[state=active]:border-primary data-[state=active]:text-primary',
      centered:
        'flex w-full items-center justify-center border-b border-card-foreground  p-3 font-inter text-[1rem] text-muted data-[state=active]:border-primary data-[state=active]:text-primary',
      pill: 'flex size-full items-center justify-center gap-2 rounded-lg bg-transparent p-3 text-[1.25rem] font-bold text-[#3E3E3E] data-[state=active]:bg-foreground data-[state=active]:text-[#3E3E3E] lg:text-[1.5rem]',
      secondary:
        'flex h-6 w-full items-center justify-center gap-2 rounded border border-card/[0.20] p-2 px-3 font-inter text-[1rem] font-medium data-[state=active]:border-primary data-[state=active]:text-primary lg:h-[36px] lg:p-3'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

interface TabTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn('size-full', className)} {...props} />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
