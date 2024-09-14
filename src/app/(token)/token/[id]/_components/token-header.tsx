import { Button } from '@/components/ui/button';
import { _formatAddress, formatAddress } from '@/lib/utils';
import { Token } from '@/types';
import { Copy, Star } from 'lucide-react';
import Link from 'next/link';

export default function TokenHeader({ token }: { token: Token }) {
  return (
    <div className="flex w-full flex-col items-start gap-6 md:h-auto">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-[1.5rem]/[0.015rem] font-bold capitalize">{token?.name}</h3>
          <div className="flex items-center gap-1">
            <span> Created by</span>
            <Link
              href={`/profile/${token.creator_id}`}
              className="hover:text-accent-200 text-primary"
            >
              {token.creator.username ?? formatAddress(token.creator.wallet_address)}
            </Link>
          </div>
        </div>
        <Button variant={'outline'} size={'icon'} className="hover:shadow-dip">
          <Star size={16} />
        </Button>
      </div>
      <div className="flex w-full items-center justify-between text-[0.875rem] font-light lg:text-[1rem]/[0.01rem]">
        <span>Contract:</span>
        <span>
          <Link
            className="hover:text-primary"
            target="__blank__"
            href={`https://scan-testnet.assetchain.org/token/${token?.contract_address}`}
          >
            {token && _formatAddress(token?.contract_address, 16)}
          </Link>
        </span>
        <Copy size={24} />
      </div>
    </div>
  );
}
