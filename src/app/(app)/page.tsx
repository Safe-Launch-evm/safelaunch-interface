import { Shell } from '@/components/shell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Banner from './_components/banner';
import TokenCard from '@/components/cards/token-card';
import { getCookieStorage } from '@/lib/cookie-storage';
import { fetchTokens } from '@/lib/actions/token';
import { formatAddress } from '@/lib/utils';
import TokenToolbar from './token-toolbar';

type HomeProps = {
  searchParams: { tab: string; search: string };
};

export default async function Home({ searchParams }: HomeProps) {
  // const address = await getCookieStorage('accountKey');
  const currentTab = searchParams.tab === undefined ? 'tokens' : searchParams.tab;
  const favorites = currentTab === 'favorites' ? true : false;
  const trending = currentTab === 'trending' ? true : false;

  const { favorites: likes, tokens } = await fetchTokens({
    favorites,
    trending,
    search: searchParams.search
  });

  const { favorites: userLikes } = await fetchTokens({ favorites: true });

  return (
    <Shell className="pt-[220px]">
      <section className="flex flex-col-reverse items-center justify-center gap-10 lg:flex-row lg:justify-between xl:gap-[213px]">
        <div className="space-y-10">
          <div className="space-y-6">
            <h1 className="text-[2rem] font-bold xl:text-[4.25rem]">
              The Future of Fair and Safe Token Creation
            </h1>
            <p className="text-[1rem]/[2rem] tracking-[0.0125rem] lg:text-[1.25rem]/[2rem]">
              SafeLaunch ensures every token is fair-launched with no presale and no team
              allocation. Join us in making the crypto space safer and more transparent for
              everyone.
            </p>
          </div>
          <Button variant={'secondary'} asChild>
            <Link href={'/create'}>Create token</Link>
          </Button>
        </div>

        <div className="px-4">
          <Banner name="SafeCoin" image="/images/banner.png" market_cap={28.22} href="/" />
        </div>
      </section>
      <TokenToolbar currentTab={currentTab} />
      <section className="space-y-10">
        <h2 className="text-[1.5rem] font-bold lg:text-[2.5rem]">Tokens</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5">
          {/* {tokens?.map(token => {
            return (
              <TokenCard
                key={token.unique_id}
                unique_id={token.unique_id}
                name={token.name}
                symbol={token.symbol}
                image={token.logo_url}
                creator_unique_id={token.creator.unique_id}
                owner={
                  token.creator.username
                    ? token.creator.username
                    : formatAddress(token.creator.wallet_address)
                }
                market_cap={22.8}
              />
            );
          })} */}

          {tokens !== null ? (
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
                      market_cap={22.8}
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
              {likes.length >= 1 ? (
                likes.map(favorite => {
                  return (
                    <TokenCard
                      key={favorite.unique_id}
                      unique_id={favorite.token_id}
                      name={favorite.token.name}
                      symbol={favorite.token.symbol}
                      image={favorite.token.logo_url}
                      creator_unique_id={favorite.token.creator_id}
                      user={favorite.user}
                      market_cap={22.8}
                    />
                  );
                })
              ) : (
                <div></div>
              )}
            </>
          ) : null}
        </div>
      </section>
    </Shell>
  );
}
