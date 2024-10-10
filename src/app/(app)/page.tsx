'use client';

import { Shell } from '@/components/shell';
import TokenToolbar from './_components/token-toolbar';
import { fetchTokens } from '@/lib/actions/token';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import Tokens from './_components/tokens';

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

  const { data: tokens, isLoading } = useQuery({
    queryFn: () =>
      fetchTokens({
        favorites,
        trending,
        search: searchParams.search
      }),
    queryKey: ['tokens', { favorites, trending, search: searchParams.search }]
  });

  const { data: favoriteTokens, isLoading: isFavoritesLoading } = useQuery({
    queryFn: () =>
      fetchTokens({
        favorites: isConnected
      }),
    queryKey: ['userTokens']
  });

  return (
    <Shell className="gap-10 pt-[140px] md:gap-[100px] md:pt-[198px]">
      <h1 className="mx-auto w-full bg-gradient-to-b from-[#80A8BA] to-[rgba(255,255,255,0.8)] bg-clip-text text-center text-[1.5rem] font-bold text-transparent md:m-auto md:w-4/5 md:pb-[30px] md:text-[54px]">
        The Future of Fair and Safe Token Creation
      </h1>
      <TokenToolbar currentTab={currentTab} />
      <Tokens
        isTokensLoading={isLoading}
        isFavoritesLoading={isFavoritesLoading}
        fetchFavorites={favoriteTokens}
        fetchTokens={tokens}
      />
    </Shell>
  );
}
