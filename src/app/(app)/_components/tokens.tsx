'use client';

import TokenCard from '@/components/cards/token-card';
import { Skeleton } from '@/components/ui/skeleton';

import { formatAddress, toIntNumberFormat } from '@/lib/utils';
import { Token, TokenLike } from '@/types';

type TokenResult = {
  favorites: TokenLike[] | null;
  tokens: Token[] | null;
};

type TokensProps = {
  isTokensLoading: boolean;
  isFavoritesLoading: boolean;
  fetchTokens: TokenResult | undefined;
  fetchFavorites: TokenResult | undefined;
};

export default function Tokens({
  isTokensLoading,
  isFavoritesLoading,
  fetchFavorites,
  fetchTokens
}: TokensProps) {
  if (isTokensLoading || isFavoritesLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 bg-card md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative rounded md:rounded-lg">
            <Skeleton
              key={i}
              className="h-[117px] rounded-t bg-gray-700 md:h-[197px] md:rounded-t-lg"
            />
            <div className="w-full space-y-2 bg-card p-2 md:p-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!fetchTokens || !fetchFavorites) {
    return null;
  }

  const { tokens, favorites } = fetchTokens;
  const { favorites: likes } = fetchFavorites;

  if (favorites) {
    return (
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {favorites.length >= 1
          ? favorites.map(favorite => {
              return (
                <TokenCard
                  key={favorite?.unique_id}
                  unique_id={favorite?.token_id}
                  name={favorite?.token.name}
                  symbol={favorite?.token.symbol}
                  image={favorite?.token.logo_url}
                  creator_unique_id={favorite?.token.creator_id}
                  user={favorite?.user}
                  market_cap={0}
                />
              );
            })
          : null}
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {tokens !== null ? (
        <>
          {tokens.length >= 1 ? (
            tokens.map(token => {
              const like = likes?.find(favorite => favorite.token_id === token.unique_id);
              return (
                <TokenCard
                  key={token.unique_id}
                  unique_id={token.unique_id}
                  name={token.name}
                  symbol={token.symbol}
                  image={token.logo_url}
                  creator_unique_id={token.creator.unique_id}
                  user={like?.user}
                  owner={
                    token.creator.username
                      ? token.creator.username
                      : formatAddress(token.creator.wallet_address)
                  }
                  market_cap={toIntNumberFormat(token?.stats?.marketStats?.marketcapInUsd)}
                />
              );
            })
          ) : (
            <div></div>
          )}
        </>
      ) : null}
    </div>
  );
}
