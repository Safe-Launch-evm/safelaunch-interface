'use client';

import { deleteFavoriteToken, favoriteToken } from '@/lib/actions/token';
import { getCookieStorage } from '@/lib/cookie-storage';
import { useFetchFavoritesQuery } from '@/lib/queries';
import { _formatAddress, formatAddress } from '@/lib/utils';
import { STATE_STATUS, Token, TokenLike } from '@/types';
import { StarIcon } from '@heroicons/react/24/outline';
import { CircleCheck, Copy, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

export default function TokenHeader({ token }: { token: Token }) {
  const { data: tokens } = useFetchFavoritesQuery();

  const isLike = tokens?.favorites?.find(favorite => favorite.token_id === token.unique_id);

  return (
    <div className="flex w-full flex-col items-start gap-6 md:h-auto">
      <div className="flex w-full items-center justify-between gap-3 md:gap-4">
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-[1.5rem]/[0.015rem] font-bold capitalize">{token?.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-foreground/[0.50]">Created by</span>
            <Link
              href={`/profile/${token.creator_id}`}
              className="text-primary hover:text-accent-200"
            >
              {token.creator.username ?? formatAddress(token.creator.wallet_address)}
            </Link>
          </div>
        </div>
        <AddToFavoriteButton tokenId={token.unique_id} favorite={isLike} />
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-1">
          <span className="text-[0.875rem] font-light text-foreground/[0.50] lg:text-[1rem]/[0.01rem]">
            Address:
          </span>
          <span>
            <Link
              className="text-[0.875rem] font-light hover:text-primary lg:text-[1rem]/[0.01rem]"
              target="__blank__"
              href={`https://scan-testnet.assetchain.org/token/${token?.contract_address}`}
            >
              {token && _formatAddress(token?.contract_address, 16)}
            </Link>
          </span>
        </span>
        <CopyAddressButton contractAddress={token.contract_address} />
      </div>
    </div>
  );
}

export function CopyAddressButton({ contractAddress }: { contractAddress: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [copied, setCopied]);

  async function handleCopy() {
    setCopied(true);
    toast.success('Copied!');
    await navigator.clipboard.writeText(contractAddress!);
  }

  return (
    <button onClick={handleCopy}>
      {copied ? <CircleCheck className="size-6" /> : <Copy className="size-6 text-primary" />}
    </button>
  );
}

function AddToFavoriteButton({
  tokenId,
  favorite
}: {
  tokenId: string;
  favorite: TokenLike | undefined;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState(STATE_STATUS.IDLE);

  async function addToFavorite() {
    const isAuth = await getCookieStorage('auth_token');

    if (!isAuth) {
      toast.warning('Pleas connect your wallet');
      return;
    }
    setStatus(STATE_STATUS.LOADING);
    try {
      const result = await favoriteToken(tokenId);
      if (result.code !== 200) {
        setStatus(STATE_STATUS.ERROR);
        toast.error('An error ocurred');
        router.refresh();
        return;
      }

      setStatus(STATE_STATUS.SUCCESS);
      toast.success('Added to favorites');
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
      const result = await deleteFavoriteToken(tokenId);
      if (result.code !== 200) {
        setStatus(STATE_STATUS.ERROR);
        toast.error('An error ocurred');
        router.refresh();
        return;
      }

      setStatus(STATE_STATUS.SUCCESS);
      toast.success('Removed from favorites');
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
    <>
      {favorite ? (
        <button
          className="flex items-center justify-center rounded-[10px] border bg-foreground p-2.5 text-primary-foreground hover:text-primary-foreground hover:shadow-btn"
          disabled={status === STATE_STATUS.LOADING}
          onClick={removeFromFavorite}
        >
          {status === STATE_STATUS.LOADING ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <StarIcon className="size-5" />
          )}
        </button>
      ) : (
        <button
          type="button"
          className="flex items-center justify-center rounded-[10px] border p-2.5 hover:bg-foreground hover:text-primary-foreground hover:shadow-btn"
          disabled={status === STATE_STATUS.LOADING}
          onClick={addToFavorite}
        >
          {status === STATE_STATUS.LOADING ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <StarIcon className="size-5" />
          )}
        </button>
      )}
    </>
  );
}
