import TokenCard from '@/components/cards/token-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchAllTokensQuery } from '@/lib/queries';
import { formatAddress, toIntNumberFormat } from '@/lib/utils';
import { Token } from '@/types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

type TokensProps = {
  currentTab: string;
  searchParams: { tab: string; search: string };
};

export default function AllTokensList({ searchParams, currentTab }: TokensProps) {
  const { data, isLoading } = useFetchAllTokensQuery({
    favorites: currentTab === 'favorites',
    trending: currentTab === 'trending',
    search: searchParams.search
  });

  if (isLoading) {
    return <TokenSkeletonList />;
  }

  if (!data?.tokens?.length) {
    return <EmptyStateMessage />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      <TokenList tokens={data.tokens} />
    </div>
  );
}

function TokenList({ tokens }: { tokens: Token[] }) {
  const { data: favoritesData } = useFetchAllTokensQuery({ favorites: true });

  const tokenCards = useMemo(() => {
    return tokens.map(token => {
      const like = favoritesData?.favorites?.find(
        favorite => favorite.token_id === token.unique_id
      );
      return (
        <TokenCard
          key={token.unique_id}
          unique_id={token.unique_id}
          name={token.name}
          symbol={token.symbol}
          image={token.logo_url}
          creator_unique_id={token.creator.unique_id}
          user={like?.user}
          owner={token.creator.username || formatAddress(token.creator.wallet_address)}
          market_cap={toIntNumberFormat(token?.stats?.marketStats?.marketcapInUsd)}
        />
      );
    });
  }, [tokens, favoritesData]);

  return <>{tokenCards}</>;
}

function TokenSkeletonList() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <TokenSkeleton key={i} />
      ))}
    </div>
  );
}

function TokenSkeleton() {
  return (
    <div className="relative rounded md:rounded-lg">
      <Skeleton className="h-[117px] rounded-t md:h-[197px] md:rounded-t-lg" />
      <div className="flex w-full flex-col gap-3 p-2 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-[22px] w-[138px] rounded" />
            <Skeleton className="h-[22px] w-[138px] rounded" />
          </div>
          <Skeleton className="h-[22px] w-[34px]" />
        </div>
        <Skeleton className="inline-block h-1 w-full rounded" />
      </div>
    </div>
  );
}

export function EmptyStateMessage() {
  return (
    <div className="w-full flex-col items-center justify-center gap-10">
      <ExclamationCircleIcon className="size-10 text-primary" />
      <p>No items in the list</p>
    </div>
  );
}
