/* eslint-disable @next/next/no-img-element */

'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ConnectWalletButton } from '@/components/wallet/wallet-connect';
import ScrollPast from './scroll-past';
import { siteConfig } from '@/config/site-config';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { WalletContext } from '@/context/wallet-context';
import { useAccount } from 'wagmi';

export default function SiteHeader() {
  const { isConnected } = useAccount();
  const { setOpen } = useContext(WalletContext);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
          'bg-background': isScrolled,
          'bg-background/95': pathname.includes('/profile')
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
                <li key={item.title}>
                  <NavItem href={item.href} title={item.title} />
                </li>
              ))}
            </ul>
            <div className="hidden lg:block">
              <ConnectWalletButton />
            </div>
            <div className="md:hidden">
              <button type="button" onClick={() => setModalOpen(true)}>
                <Bars3BottomLeftIcon className="size-6" />
              </button>
            </div>
          </nav>
        </div>
        <aside
          className={`top-0 md:hidden ${modalOpen ? 'translate-x-0' : 'translate-x-full'} fixed z-10 grid size-full grid-rows-[100px_1fr_100px] bg-background transition-transform duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between px-4 py-10">
            <img alt="logo" src={'/images/logo.svg'} className="h-6 w-[41px]" />
            <div>
              <button className="" onClick={() => setModalOpen(false)}>
                <XMarkIcon className="size-6" />
              </button>
            </div>
          </div>
          <ul className="flex flex-col items-start gap-10 px-4">
            {siteConfig.nav.map(item => (
              <li key={item.title}>
                <NavItem href={item.href} title={item.title} />
              </li>
            ))}
          </ul>
          <div className="flex w-full items-center justify-center px-4">
            {isConnected ? (
              <ConnectWalletButton />
            ) : (
              <Button
                type="button"
                fullWidth
                onClick={() => {
                  setModalOpen(false);
                  setOpen(true);
                }}
              >
                Connect wallet
              </Button>
            )}
          </div>
        </aside>
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
