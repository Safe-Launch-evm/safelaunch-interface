'use client';
import TokenCard from '@/components/cards/token-card';
import { fetchTokens } from '@/lib/actions/token';
import { formatAddress, toIntNumberFormat } from '@/lib/utils';
import { use } from 'react';

type TokensProps = {
  fetchTokenPromise: ReturnType<typeof fetchTokens>;
  fetchUserTokenPromise: ReturnType<typeof fetchTokens>;
};

export default function Tokens({ fetchTokenPromise, fetchUserTokenPromise }: TokensProps) {
  const { favorites: likes, tokens } = use(fetchTokenPromise);
  const { favorites: userLikes } = use(fetchUserTokenPromise);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {tokens !== null ? (
        <>
          {tokens.length >= 1 ? (
            tokens.map(token => {
              const like = userLikes?.find(favorite => favorite.token_id === token.unique_id);
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
      {likes !== null ? (
        <>
          {likes?.length >= 1 ? (
            likes?.map(favorite => {
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
          ) : (
            <div></div>
          )}
        </>
      ) : null}
    </div>
  );
}
