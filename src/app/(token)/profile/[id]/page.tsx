import OwnedTokenCard from '@/components/cards/owned-token';
import { Shell } from '@/components/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserTokens } from '@/lib/actions/user';
import { getCookieStorage } from '@/lib/cookie-storage';
import { formatAddress } from '@/lib/utils';
import Image from 'next/image';

export default async function Profile({ params }: { params: { id: string } }) {
  const address = await getCookieStorage('accountKey');

  const { favorites, tokens } = await getUserTokens(params.id);

  return (
    <Shell variant={'center'} className="pt-[150px]">
      <section className="flex w-full max-w-4xl flex-col items-center justify-center gap-10">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <Image
            src={'/images/banner.png'}
            alt=""
            width={142}
            height={142}
            className="size-[142px] rounded-full border"
          />

          <h1>K.tiki</h1>
          <p>BsD8ieissMcvvCoH49HPtoruQxuiHtSjKZ1JzHMEqM3q</p>
        </div>
        <p className="text-center text-[1.125rem]/[2rem]">
          Safetoken presents a new era in cryptocurrency, where safety, fairness, and community
          are at the forefront. Join us in building a secure future for all digital asset
          enthusiasts. ensuring that every participant has an equal opportunity to acquire and
          benefit from the token.
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
            <TabsTrigger value="notifications" variant={'secondary'}>
              Notifications
            </TabsTrigger>
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
                      // owner={
                      //   token.creator.username
                      //     ? token.creator.username
                      //     : formatAddress(token.creator.wallet_address)
                      // }
                      market_cap={22.8}
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
                      user={favorite.user}
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
