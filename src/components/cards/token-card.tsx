/* eslint-disable @next/next/no-img-element */
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LoaderCircle, Star } from 'lucide-react';
import { AspectRatio } from '../ui/aspect-ratio';
import { PlaceholderImage } from '../placeholder-image';
import Link from 'next/link';
import { formatAddress, truncate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { STATE_STATUS } from '@/types';
import { deleteFavoriteToken, favoriteToken } from '@/lib/actions/token';
import { toast } from 'sonner';
import { getCookieStorage } from '@/lib/cookie-storage';
import { StarIcon } from '@heroicons/react/24/outline';
import { Progress } from '../ui/progress';
import ImageComponent from '../image-component';

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
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [status, setStatus] = useState(STATE_STATUS.IDLE);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });
    }
  }

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
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      className="relative rounded-lg bg-card shadow-md shadow-card"
    >
      <div
        className="absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
        style={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 80%)`,
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none'
        }}
      />
      <Link href={`/token/${token.unique_id}`} className="relative w-full">
        <div className="aspect-square h-[197px] rounded-t-lg bg-card">
          <ImageComponent
            src={token.image}
            alt={token.name}
            fill={true}
            className="rounded-t-lg object-cover"
          />
        </div>
      </Link>

      <button className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg bg-card p-[6px] text-foreground hover:text-primary hover:shadow-btn">
        <StarIcon className="size-4" />
      </button>
      <Link href={`/token/${token.unique_id}`}>
        <div className="flex flex-col items-start gap-6 rounded-b-lg bg-card p-4">
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full items-center justify-between">
              <p className="text-[1rem] font-bold md:text-[20px]">
                {truncate(token.name, 14)}
              </p>

              <span className="rounded bg-primary px-2 py-1 text-[0.75rem] md:text-[1.125rem]">
                ${token.symbol}
              </span>
            </div>
            <p className="text-[0.875rem] font-light text-slate-400 md:text-[1rem]">
              Created by{' '}
              <Link href={`/profile/${token.creator_unique_id}`}>
                {truncate(token.owner!, 10) ?? 'view'}
              </Link>
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <div>
              <Progress value={55} />
            </div>
            <p className="text-[0.875rem] font-light md:text-[18px]">
              Marketcap: <span className="text-primary">{token.market_cap}</span>
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
