import OwnedTokenCard from '@/components/cards/owned-token';
import { Shell } from '@/components/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserById, getUserTokens } from '@/lib/actions/user';
import { getCookieStorage } from '@/lib/cookie-storage';
import { toIntNumberFormat } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default async function Profile({ params }: { params: { id: string } }) {
  const address = await getCookieStorage('accountKey');
  const { favorites, tokens } = await getUserTokens(params.id);
  const data = await getUserById(params.id);

  // console.log({ data });

  return (
    <Shell variant={'center'} className="pt-[150px]">
      <section className="flex w-full max-w-4xl flex-col items-center justify-center gap-10">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          {data?.profile_image && (
            <Image
              src={data?.profile_image}
              alt=""
              width={142}
              height={142}
              className="size-[142px] rounded-full border"
            />
          )}

          {data?.username && <h1>@{data?.username}</h1>}
          <p>
            <Link
              className="hover:text-primary"
              target="__blank__"
              href={`https://scan-testnet.assetchain.org/address/${data?.wallet_address}`}
            >
              {data?.wallet_address}
            </Link>
          </p>
        </div>
        <p className="text-center text-[1.125rem]/[2rem] first-letter:capitalize">
          {data?.bio}
        </p>
      </section>
      <div className="">
        <Tabs defaultValue="created" className="flex flex-col items-center justify-center">
          <TabsList variant={'secondary'}>
            <TabsTrigger value="created" variant={'secondary'}>
              Created
            </TabsTrigger>
            <TabsTrigger value="favorites" variant={'secondary'}>
              Favorites
            </TabsTrigger>
            {/* <TabsTrigger value="notifications" variant={'secondary'}>
              Notifications
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="created">
            <section className="grid grid-cols-2 gap-4 py-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5">
              {tokens.length >= 1 ? (
                tokens.map(token => {
                  const like = favorites?.find(
                    favorite => favorite.token_id === token.unique_id
                  );
                  return (
                    <OwnedTokenCard
                      key={token.unique_id}
                      unique_id={token.unique_id}
                      name={token.name}
                      symbol={token.symbol}
                      image={token.logo_url}
                      user={like?.user}
                      curve_stats={token?.stats?.curveStats}
                      owner={data?.username ?? data?.wallet_address}
                      // owner={
                      //   token.creator.username
                      //     ? token.creator.username
                      //     : formatAddress(token.creator.wallet_address)
                      // }
                      market_cap={toIntNumberFormat(token?.stats?.marketStats?.marketcapInUsd)}
                    />
                  );
                })
              ) : (
                <div></div>
              )}
            </section>
          </TabsContent>
          <TabsContent value="favorites">
            <section className="grid grid-cols-2 gap-4 py-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5">
              {favorites.length >= 1 ? (
                favorites.map(favorite => {
                  return (
                    <OwnedTokenCard
                      key={favorite.unique_id}
                      unique_id={favorite.token_id}
                      name={favorite.token.name}
                      symbol={favorite.token.symbol}
                      image={favorite.token.logo_url}
                      creator_unique_id={favorite.token.creator_id}
                      // user={data?.username}
                      owner={data?.username ?? undefined}
                      market_cap={22.8}
                    />
                  );
                })
              ) : (
                <div></div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
