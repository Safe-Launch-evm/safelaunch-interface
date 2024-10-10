'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const frameworks = [
  {
    value: 'favorites',
    label: 'favorites'
  },
  {
    value: 'trending',
    label: 'trending'
  }
];

export function SelectFilter() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('trending');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-10 items-center gap-2 rounded-lg border border-border px-4 py-1 capitalize md:h-[52px]">
          <span className="text-[1.25rem]/[1.75rem] text-primary">
            {value
              ? frameworks.find(framework => framework.value === value)?.label
              : 'Trending'}
          </span>

          <ChevronDownIcon className="size-6 shrink-0 text-foreground/[0.50]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search framework..." /> */}
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map(framework => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={currentValue => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === framework.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
