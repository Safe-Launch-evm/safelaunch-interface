import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ConnectWalletButton } from '../wallet/wallet-connect';

export default function TokenHeader() {
  return (
    <nav className="fixed z-50 w-full bg-background/30 backdrop-blur-[12px]">
      <div className="container mx-auto flex w-full max-w-screen-2xl items-center justify-between border-b border-border px-4 py-6 lg:px-[67px]">
        <Link href="/" className="text-[1.25rem]">
          Back
        </Link>
        <ConnectWalletButton />
        {/* <Button variant={'ghost'} className="font-light">
          BsD8ies...
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M12 16L4 8H20L12 16Z" fill="#80A8BA" />
          </svg>
        </Button> */}
      </div>
    </nav>
  );
}
