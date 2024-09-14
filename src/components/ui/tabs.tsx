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
      pill: 'flex w-full justify-center items-center border rounded-lg',
      secondary:
        'flex items-center justify-center gap-4 rounded-lg border border-card-foreground bg-card p-2'
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
        'border-b border-card-foreground flex items-start justify-center  p-3 text-[1rem] font-inter text-muted data-[state=active]:border-primary data-[state=active]:text-primary',
      pill: 'flex items-center w-full lg:min-w-[190px] h-full text-[#3E3E3E] justify-center p-3 gap-2 rounded-lg text-[1.25rem] lg:text-[1.5rem] font-bold data-[state=active]:text-foreground/[0.8] data-[state=active]:bg-secondary',
      secondary:
        'flex items-center lg:h-[36px] h-6 p-2 lg:p-3 font-medium font-inter text-[1rem] rounded border w-full justify-center py-2 px-3 gap-2 border-card/[0.20] data-[state=active]:text-primary data-[state=active]:border-primary'
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
