import { Shell } from '@/components/shell';
import { fetchTokens } from '@/lib/actions/token';
import TokenToolbar from './_components/token-toolbar';
import Tokens from './_components/tokens';

type HomeProps = {
  searchParams: { tab: string; search: string };
};

export default function Home({ searchParams }: HomeProps) {
  const currentTab = searchParams.tab === undefined ? 'tokens' : searchParams.tab;
  const favorites = currentTab === 'favorites' ? true : false;
  const trending = currentTab === 'trending' ? true : false;

  const fetchTokenPromise = fetchTokens({
    favorites,
    trending,
    search: searchParams.search
  });

  const fetchUserTokenPromise = fetchTokens({ favorites: true });

  return (
    <Shell className="pt-[198px]">
      <h1 className="m-auto w-full bg-gradient-to-b from-[#80A8BA] to-[rgba(255,255,255,0.8)] bg-clip-text pb-[130px] text-center text-[24px] font-bold text-transparent md:w-4/5 md:text-[54px]">
        The Future of Fair and Safe Token Creation
      </h1>

      <TokenToolbar currentTab={currentTab} />
      <Tokens
        fetchTokenPromise={fetchTokenPromise}
        fetchUserTokenPromise={fetchUserTokenPromise}
      />
    </Shell>
  );
}
