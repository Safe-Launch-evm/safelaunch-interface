'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BaseProps {
  children: React.ReactNode;
}

interface RootWalletModalProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface WalletModalProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = '(min-width: 768px)';

const WalletModal = ({ children, ...props }: RootWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModal = isDesktop ? Dialog : Drawer;

  return <WalletModal {...props}>{children}</WalletModal>;
};

const WalletModalTrigger = ({ className, children, ...props }: WalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <WalletModalTrigger className={className} {...props}>
      {children}
    </WalletModalTrigger>
  );
};

const WalletModalClose = ({ className, children, ...props }: WalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModalClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <WalletModalClose className={className} {...props}>
      {children}
    </WalletModalClose>
  );
};

const WalletModalContent = ({ className, children, ...props }: WalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModalContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <WalletModalContent
      className={cn(
        'rounded-t-3xl sm:rounded-[12px] [&>button]:right-[26px] [&>button]:top-[26px]',
        className
      )}
      onOpenAutoFocus={e => e.preventDefault()}
      {...props}
    >
      {children}
    </WalletModalContent>
  );
};

const WalletModalDescription = ({ className, children, ...props }: WalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModalDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <WalletModalDescription className={className} {...props}>
      {children}
    </WalletModalDescription>
  );
};

const WalletModalHeader = ({ className, children, ...props }: WalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModalHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <WalletModalHeader className={cn('space-y-0 pb-6 md:pb-3', className)} {...props}>
      {children}
    </WalletModalHeader>
  );
};

const WalletModalTitle = ({ className, children, ...props }: WalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModalTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <WalletModalTitle className={cn('text-center', className)} {...props}>
      {children}
    </WalletModalTitle>
  );
};

const WalletModalBody = ({ className, children, ...props }: WalletModalProps) => {
  return (
    <ScrollArea
      className={cn(
        'h-[234px] max-h-[300px] px-6 md:-mr-4 md:h-full md:min-h-[260px] md:px-0 md:pr-4',
        className
      )}
      {...props}
    >
      {children}
    </ScrollArea>
  );
};

const WalletModalFooter = ({ className, children, ...props }: WalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const WalletModalFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <WalletModalFooter className={cn('py-3.5 md:py-0', className)} {...props}>
      {children}
    </WalletModalFooter>
  );
};

export {
  WalletModal,
  WalletModalTrigger,
  WalletModalClose,
  WalletModalContent,
  WalletModalDescription,
  WalletModalHeader,
  WalletModalTitle,
  WalletModalBody,
  WalletModalFooter
};

/*
 * Hook used to calculate the width of the screen using the
 * MediaQueryListEvent. This can be moved to a separate file
 * if desired (src/hooks/use-media-query.tsx).
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
}
