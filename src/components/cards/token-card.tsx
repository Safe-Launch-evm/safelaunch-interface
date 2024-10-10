/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import { LoaderCircle, Star } from 'lucide-react';
import { AspectRatio } from '../ui/aspect-ratio';
import { PlaceholderImage } from '../placeholder-image';
import Link from 'next/link';
import { formatAddress, truncate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { STATE_STATUS } from '@/types';
import { deleteFavoriteToken, favoriteToken } from '@/lib/actions/token';
import { toast } from 'sonner';
import { getCookieStorage } from '@/lib/cookie-storage';
import { StarIcon } from '@heroicons/react/24/outline';

type TokenCardProps = {
  unique_id: string;
  name: string;
  symbol: string;
  image: string;
  owner?: string;
  market_cap: any;
  user?: object;
  creator_unique_id: string;
};

export default function TokenCard({ ...token }: TokenCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState(STATE_STATUS.IDLE);

  async function addToFavorite() {
    const isAuth = await getCookieStorage('auth_token');

    if (!isAuth) {
      toast.warning('Pleas connect your wallet');
      return;
    }

    setStatus(STATE_STATUS.LOADING);

    try {
      const result = await favoriteToken(token.unique_id);
      if (result.code !== 200) {
        setStatus(STATE_STATUS.ERROR);
        toast.error('An error ocurred');
        router.refresh();
        return;
      }

      setStatus(STATE_STATUS.SUCCESS);
      toast.error('Added to favorites');
      router.refresh();
      return;
    } catch (error) {
      setStatus(STATE_STATUS.ERROR);
      toast.error('An error ocurred');
      router.refresh();
      return;
    }
  }
  async function removeFromFavorite() {
    const isAuth = await getCookieStorage('auth_token');

    if (!isAuth) {
      toast.warning('Pleas connect your wallet');
      return;
    }
    setStatus(STATE_STATUS.LOADING);
    try {
      const result = await deleteFavoriteToken(token.unique_id);
      if (result.code !== 200) {
        setStatus(STATE_STATUS.ERROR);
        toast.error('An error ocurred');
        router.refresh();
        return;
      }

      setStatus(STATE_STATUS.SUCCESS);
      toast.error('Removed');
      router.refresh();
      return;
    } catch (error) {
      setStatus(STATE_STATUS.ERROR);
      toast.error('An error ocurred');
      router.refresh();
      return;
    }
  }

  return (
    <div className="relative rounded bg-card md:rounded-lg">
      <Link
        href={`/token/${token.unique_id}`}
        className="h-[117px] w-full rounded-t bg-card md:h-[197px]"
      >
        <div
          className="h-[117px] rounded-t bg-gray-700 md:h-[197px] md:rounded-t-lg"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            background: `url('${'/images/token-image.png'}')`
          }}
        ></div>
      </Link>

      <button className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg bg-card p-[6px] text-foreground hover:text-primary hover:shadow-btn">
        <StarIcon className="size-4" />
      </button>

      <Link href={`/token/${token.unique_id}`}>
        <div className="p-2 md:p-4">
          <div className="grid grid-cols-[3fr_1fr] items-center">
            <div>
              <p className="text-[1rem] font-bold md:text-[20px]">
                {truncate(token.name, 14)}
              </p>
              <p className="text-[0.875rem] font-light text-slate-400 md:text-[1rem]">
                Created by{' '}
                <Link href={`/profile/${token.creator_unique_id}`}>
                  {truncate(token.owner!, 10) ?? 'view'}
                </Link>
              </p>
            </div>
            <div className="text-right">
              <span className="rounded bg-primary px-2 py-1 text-[0.75rem] md:text-[1.125rem]">
                ${token.symbol}
              </span>
            </div>
          </div>
          <div className="flex gap-1 py-2">
            <span className="inline-block h-1 w-4/5 rounded bg-primary" />
            <span className="inline-block h-1 w-1/5 rounded bg-slate-200" />
          </div>
          <div>
            <p className="text-[0.875rem] font-light md:text-[18px]">
              Marketcap: <span className="text-primary">{token.market_cap}</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
