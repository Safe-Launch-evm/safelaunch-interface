'use client';

import { Button } from '@/components/ui/button';
import { deleteFavoriteToken, favoriteToken } from '@/lib/actions/token';
import { getCookieStorage } from '@/lib/cookie-storage';
import { _formatAddress, formatAddress } from '@/lib/utils';
import { STATE_STATUS, Token, TokenLike } from '@/types';
import { CircleCheck, Copy, LoaderCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

export default function TokenHeader({
  token,
  favorites
}: {
  token: Token;
  favorites: TokenLike[] | null;
}) {
  const isLike = favorites?.find(favorite => favorite.token_id === token.unique_id);

  return (
    <div className="flex w-full flex-col items-start gap-6 md:h-auto">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-[1.5rem]/[0.015rem] font-bold capitalize">{token?.name}</h3>
          <div className="flex items-center gap-1">
            <span> Created by</span>
            <Link
              href={`/profile/${token.creator_id}`}
              className="text-primary hover:text-accent-200"
            >
              {token.creator.username ?? formatAddress(token.creator.wallet_address)}
            </Link>
          </div>
        </div>
        <AddToFavoriteButton tokenId={token.unique_id} favorite={isLike} />
        {/* <Button variant={'outline'} size={'icon'} className="hover:shadow-dip">
          <Star size={16} />
        </Button> */}
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
        {/* <Copy size={24} /> */}
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
      {copied ? <CircleCheck className="size-6 text-primary" /> : <Copy className="size-6" />}
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
      const result = await deleteFavoriteToken(tokenId);
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
    <>
      {favorite ? (
        <button
          className="flex size-[34px] items-center justify-center rounded-lg border bg-primary text-primary-foreground hover:text-primary-foreground hover:shadow-dip"
          disabled={status === STATE_STATUS.LOADING}
          onClick={removeFromFavorite}
        >
          {status === STATE_STATUS.LOADING ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Star size={16} />
          )}
        </button>
      ) : (
        <button
          type="button"
          className="flex size-[34px] items-center justify-center rounded-lg border hover:bg-primary hover:text-primary-foreground hover:shadow-dip"
          disabled={status === STATE_STATUS.LOADING}
          onClick={addToFavorite}
        >
          {status === STATE_STATUS.LOADING ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Star size={16} />
          )}
        </button>
      )}
    </>
  );
}
