/* eslint-disable @next/next/no-img-element */

'use client';

import Link from 'next/link';
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ConnectWalletButton } from '@/components/wallet/wallet-connect';
import ScrollPast from './scroll-past';
import { siteConfig } from '@/config/site-config';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '@/context/wallet-context';

export default function SiteHeader() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { setOpen } = useContext(WalletContext);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="fixed z-50 w-full">
        <div className="w-full bg-background/5 backdrop-blur-[5px]">
          <nav className="container mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-2 md:py-4 lg:px-[100px]">
            <Link href={'/'}>
              <Button
                variant={'ghost'}
                className="h-8 text-[1.25rem] font-light text-[#79797D] md:h-auto"
              >
                <ChevronLeft className="size-6" /> Back
              </Button>
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
