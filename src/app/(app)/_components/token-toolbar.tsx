'use client';

import Link from 'next/link';
import React, { useState, useTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, SortDescIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';

import {
  ListBulletIcon,
  Squares2X2Icon,
  BarsArrowDownIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { SelectFilter } from './select-filter';

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
    <section className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
      <div className="relative flex h-[52px] w-full items-center gap-2 rounded-lg border border-border bg-[#131214] px-4 py-3">
        <MagnifyingGlassIcon className="size-6 text-primary" />
        <input
          type="search"
          placeholder="Token search"
          className="w-full border-none bg-[#131214] p-0 font-inter text-[1.25rem]/[1.75rem] placeholder:text-foreground/[0.50] focus:outline-none"
          value={search ?? ''}
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex w-full items-center justify-between gap-6 md:w-auto">
        <SelectFilter />
        <div className="flex h-10 gap-2 md:h-[52px]">
          <button className="flex h-full w-[52px] items-center justify-center rounded-[8px] border border-border">
            <ListBulletIcon className="size-5 text-muted" />
          </button>
          <button className="flex h-full w-[52px] items-center justify-center rounded-[8px] border border-muted">
            <Squares2X2Icon className="size-5 text-muted" />
          </button>
          <button className="flex h-full w-[52px] items-center justify-center rounded-[8px] border border-muted">
            <BarsArrowDownIcon className="size-5 text-muted" />
          </button>
        </div>
      </div>
    </section>
    // <section className="grid gap-4 lg:grid-cols-[2fr_1fr] lg:gap-8">
    //   <div className="relative h-[52px] w-full">
    //     <Search className="absolute left-4 top-4 size-5 text-primary" />
    //     <input
    //       type="search"
    //       placeholder="Search Token"
    //       className="w-full rounded-lg border border-border bg-card px-4 py-3 pl-11 font-inter text-[1.25rem] placeholder:text-[#CECECE] focus:outline-none"
    //       value={search ?? ''}
    //       onChange={(e: any) => setSearch(e.target.value)}
    //     />
    //   </div>
    //   <div className="flex h-[52px] gap-3">
    //     <div className="flex-1">
    //       <select className="size-full rounded-[8px] border border-border bg-transparent">
    //         <option>Market Cap</option>
    //       </select>
    //     </div>
    //     <div className="flex h-full gap-2">
    //       <button className="flex h-full w-[52px] items-center justify-center rounded-[8px] border border-border">
    //         <ListBulletIcon className="size-5 text-muted" />
    //       </button>
    //       <button className="flex h-full w-[52px] items-center justify-center rounded-[8px] border border-muted">
    //         <Squares2X2Icon className="size-5 text-muted" />
    //       </button>
    //       <button className="flex h-full w-[52px] items-center justify-center rounded-[8px] border border-muted">
    //         <BarsArrowDownIcon className="size-5 text-muted" />
    //       </button>
    //     </div>
    //   </div>
    // </section>
  );
}

// export const MainTab = ({ selected }: { selected: string }) => {
//   const { address } = useAccount();
//   const tabs = [
//     'tokens',
//     'favorites'
//     // , 'following', 'scams'
//   ];
//   return (
//     <>
//       {tabs.map(tab => {
//         const active = selected === tab;
//         if (tab === 'favorites' && !address) {
//           return null;
//         }
//         return (
//           <Link
//             href={`/?tab=${tab}`}
//             key={tab}
//             className={cn(
//               buttonVariants({
//                 variant: 'outline',
//                 size: 'tab',
//                 className: `capitalize ${active && 'border-primary text-primary'}`
//               })
//             )}
//             scroll
//           >
//             {tab}
//           </Link>
//         );
//       })}
//     </>
//   );
// };
