/* eslint-disable @next/next/no-img-element */

'use client';

import Link from 'next/link';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { ConnectWalletButton } from '@/components/wallet/wallet-connect';
import ScrollPast from './scroll-past';
import { siteConfig } from '@/config/site-config';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';

export default function SiteHeader() {
  const router = useRouter();
  return (
    <>
      <header className="fixed z-50 w-full">
        <div className="w-full bg-background/5 backdrop-blur-[5px]">
          <nav className="container mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-2 md:py-4 lg:px-[100px]">
            <Button
              variant={'ghost'}
              className="text-[1.25rem] font-light text-[#79797D]"
              onClick={() => router.push('/')}
            >
              <ChevronLeft className="size-6" /> Back
            </Button>
            <ul className="hidden items-center gap-6 lg:inline-flex">
              {siteConfig.nav.map(item => (
                <li key={item.href}>
                  <NavItem href={item.href} title={item.title} />
                </li>
              ))}
            </ul>
            <div className="hidden lg:block">
              <ConnectWalletButton />
            </div>
            <div className="md:hidden">
              <button>
                <Bars3BottomLeftIcon className="size-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

const NavItem = ({ href, title }: { href: string; title: string }) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        'rounded-[20px] p-2 px-3 text-[1.25rem]/[1.75rem] transition-colors duration-200 ease-in hover:bg-[#29282E] hover:text-primary',
        {
          'text-primary': pathname === href
        }
      )}
    >
      {title}
    </Link>
  );
};
