'use client';

import React, { useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  ListBulletIcon,
  Squares2X2Icon,
  BarsArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

type ToolbarProps = {
  currentTab: string;
};

const options = [
  {
    value: 'trending',
    label: 'trending'
  },
  {
    value: 'favorites',
    label: 'favorites'
  }
];

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
        {/* <SelectFilter /> */}
        <FilterSelect options={options} placeholder={options[0].label} />
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
  );
}
export interface SelectProps {
  options?: { label: string; value: string }[];
  placeholder: string;
}

const FilterSelect = ({ options, placeholder }: SelectProps) => {
  // const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState('trending');

  return (
    <Select>
      <SelectTrigger className="h-10 w-full bg-transparent md:h-[52px] md:w-[196px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
