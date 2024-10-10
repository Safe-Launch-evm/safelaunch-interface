'use client';

import { Shell } from '@/components/shell';
import TokenToolbar from './_components/token-toolbar';
// import Tokens from './_components/tokens';
import { fetchTokens } from '@/lib/actions/token';
import TokenCard from '@/components/cards/token-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { formatAddress, toIntNumberFormat } from '@/lib/utils';
import { useAccount } from 'wagmi';

type HomeProps = {
  searchParams: { tab: string; search: string };
};

export default function Home({ searchParams }: HomeProps) {
  const { isConnected } = useAccount();
  const currentTab = searchParams.tab === undefined ? 'tokens' : searchParams.tab;
  const favorites = currentTab === 'favorites' ? true : false;
  const trending = currentTab === 'trending' ? true : false;
  // const fetchTokenPromise = fetchTokens({
  //   favorites,
  //   trending,
  //   search: searchParams.search
  // });

  // const fetchUserTokenPromise = fetchTokens({ favorites: true });

  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchTokens({
        favorites,
        trending,
        search: searchParams.search
      }),
    queryKey: ['tokens', { favorites, trending, search: searchParams.search }]
  });

  const { data: userTokens, isLoading: isLikesLoading } = useQuery({
    queryFn: () =>
      fetchTokens({
        favorites: isConnected
      }),
    queryKey: ['userTokens']
  });

  if (isLoading || isLikesLoading) {
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

  const { favorites: likes, tokens } = data ?? {};
  const { favorites: userLikes } = userTokens ?? {};

  return (
    <Shell className="gap-10 pt-[140px] md:gap-[100px] md:pt-[198px]">
      <h1 className="mx-auto w-full bg-gradient-to-b from-[#80A8BA] to-[rgba(255,255,255,0.8)] bg-clip-text text-center text-[1.5rem] font-bold text-transparent md:m-auto md:w-4/5 md:pb-[30px] md:text-[54px]">
        The Future of Fair and Safe Token Creation
      </h1>
      <TokenToolbar currentTab={currentTab} />
      {/* <Tokens
        currentTab={currentTab}
        searchParams={searchParams}
        fetchTokenPromise={fetchTokenPromise}
        fetchUserTokenPromise={fetchUserTokenPromise}
      /> */}
      {/* {isLoading || isLikesLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="relative rounded md:rounded-lg">
              <Skeleton key={i} className="h-[117px] rounded-t md:h-[197px] md:rounded-t-lg" />
              <div className="w-full bg-card p-2 md:p-4">
                <div className="grid grid-cols-[3fr_1fr] items-center">
                  <div>
                    <Skeleton className="h-[22px] w-[138px] rounded" />
                    <Skeleton className="h-[22px] w-[138px] rounded" />
                  </div>
                  <div>
                    <Skeleton className="h-[22px] w-[34px]" />
                  </div>
                </div>
                <div className="flex gap-1 py-2">
                  <span className="inline-block h-1 w-full rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null} */}

      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {tokens ? (
          <>
            {tokens.length >= 1 ? (
              tokens.map(token => {
                const like = userLikes?.find(
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
        {likes ? (
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
    </Shell>
  );
}
