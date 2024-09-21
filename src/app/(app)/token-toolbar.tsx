'use client';

import Link from 'next/link';
import React, { useState, useTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, SortDescIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@/components/wallet/wallet-connect';
import { useAccount } from 'wagmi';

type ToolbarProps = {
  currentTab: string;
};

export default function TokenToolbar({ currentTab }: ToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchParm = searchParams?.get('search');

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const [search, setSearch] = useState<string | null>(searchParm ?? null);
  const debouncedText = useDebounce(search, 500);

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        search: debouncedText || null
      });

      if (newQueryString) {
        router.push(`${pathname}?${newQueryString}`, { scroll: false });
      } else {
        router.push(pathname, { scroll: false });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText, pathname, router, createQueryString]);

  return (
    <section
      id="toolbar"
      className="flex w-full flex-col items-center justify-between gap-4 py-6 lg:flex-row"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-4 rounded-lg border border-card-foreground bg-card p-2">
          <MainTab selected={currentTab} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-4 size-6 text-muted" />
          <input
            type="search"
            placeholder="Search anything...."
            className="w-full max-w-[434px] rounded-lg border border-border bg-card px-4 py-3 pl-11 font-inter text-[1.25rem] placeholder:text-[#CECECE]"
            value={search ?? ''}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex size-[44px] items-center justify-center rounded-full border bg-primary lg:size-[54px]">
          <SortDescIcon size={22} />
        </div>
      </div>
    </section>
  );
}

export const MainTab = ({ selected }: { selected: string }) => {
  const { address } = useAccount();
  const tabs = ['tokens', 'favorites'
  // , 'following', 'scams'
];
  return (
    <>
      {tabs.map(tab => {
        const active = selected === tab;
        if (tab === 'favorites' && !address) {
          return null;
        }
        return (
          <Link
            href={`/?tab=${tab}`}
            key={tab}
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'tab',
                className: `capitalize ${active && 'border-primary text-primary'}`
              })
            )}
            scroll
          >
            {tab}
          </Link>
        );
      })}
    </>
  );
};
