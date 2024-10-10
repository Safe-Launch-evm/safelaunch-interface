/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { ConnectWalletButton } from '@/components/wallet/wallet-connect';
import ScrollPast from './scroll-past';
import { siteConfig } from '@/config/site-config';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  // track page on scroll
  useEffect(() => {
    const changeBgColor = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    };
    window.addEventListener('scroll', changeBgColor);
    return () => window.removeEventListener('scroll', changeBgColor);
  }, [isScrolled]);

  return (
    <>
      <header
        className={cn('fixed z-50 w-full bg-transparent', {
          'bg-background': isScrolled
        })}
      >
        <ScrollPast />
        <div className="w-full">
          <nav className="container mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-2 md:py-4 lg:px-[100px]">
            <Link href={'/'}>
              <img
                alt="logo"
                src={'/images/logo.svg'}
                className="h-6 w-[41px] md:h-[44px] md:w-[75px]"
              />
            </Link>
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
