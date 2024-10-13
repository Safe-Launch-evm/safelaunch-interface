import { Skeleton } from '@/components/ui/skeleton';
import { useUserTokens } from '@/lib/queries';
import { UserType } from '@/types';
import UserTokenCard from '@/components/cards/user-token-card';
import { toIntNumberFormat } from '@/lib/utils';

export function UserTokens({ user }: { user: UserType }) {
  const { data, isLoading } = useUserTokens(user.unique_id);

  if (isLoading) {
    return (
      <section className="grid grid-cols-2 gap-4 py-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative rounded md:rounded-lg">
            <Skeleton key={i} className="h-[117px] rounded-t md:h-[197px] md:rounded-t-lg" />
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
        ))}
      </section>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center">
        <p>No coins created</p>
      </div>
    );
  }

  return (
    <section className="grid w-full grid-cols-1 gap-4 px-3 py-6 md:grid-cols-2 md:px-0 lg:grid-cols-4 lg:gap-6">
      {data.tokens.length >= 1 ? (
        data.tokens.map(token => {
          const like = data.favorites?.find(favorite => favorite.token_id === token.unique_id);
          return (
            <UserTokenCard
              key={token.unique_id}
              unique_id={token.unique_id}
              name={token.name}
              symbol={token.symbol}
              image={token.logo_url}
              user={like?.user}
              creator_unique_id={token.creator_id}
              // curve_stats={token?.stats?.curveStats}
              market_cap={toIntNumberFormat(token?.stats?.marketStats?.marketcapInUsd)}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </section>
  );
}

export function UserLikedTokens({ user }: { user: UserType }) {
  const { data, isLoading } = useUserTokens(user.unique_id);

  if (isLoading) {
    return (
      <section className="grid grid-cols-2 gap-4 py-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative rounded md:rounded-lg">
            <Skeleton key={i} className="h-[117px] rounded-t md:h-[197px] md:rounded-t-lg" />
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
        ))}
      </section>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center">
        <p>No coins created</p>
      </div>
    );
  }

  return (
    <section className="grid w-full grid-cols-1 gap-4 px-3 py-6 md:grid-cols-2 md:px-0 lg:grid-cols-4 lg:gap-6">
      {data.favorites.length >= 1 ? (
        data.favorites.map(favorite => {
          const like = data.favorites?.find(
            favorite => favorite.token_id === favorite.unique_id
          );
          return (
            <UserTokenCard
              key={favorite.token.unique_id}
              unique_id={favorite.token.unique_id}
              name={favorite.token.name}
              symbol={favorite.token.symbol}
              image={favorite.token.logo_url}
              user={like?.user}
              creator_unique_id={favorite.token.creator_id}
              // curve_stats={token?.stats?.curveStats}
              market_cap={toIntNumberFormat(
                favorite.token?.stats?.marketStats?.marketcapInUsd
              )}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </section>
  );
}
