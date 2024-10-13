/* eslint-disable @next/next/no-img-element */
'use client';

import { Shell } from '@/components/shell';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserDetails } from '@/lib/queries';
import { GlobeAltIcon, ShareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { UserLikedTokens, UserTokens } from './components/token-list';
export default function Profile({ params }: { params: { id: string } }) {
  // const address = await getCookieStorage('accountKey');
  // const { favorites, tokens } = await getUserTokens(params.id);
  // const data = await getUserById(params.id);

  // console.log({ data });

  const { data: user } = useUserDetails(params.id);
  // const { data } = useUserTokens(params.id);

  if (!user) {
    return;
  }

  // const { favorites, tokens } = data;

  return (
    <Shell className="gap-6 p-0 pt-[102px] lg:gap-10 lg:px-0">
      <div className="relative h-[133px] w-full md:h-[253px]">
        <Image
          src={'/images/profile-banner.png'}
          alt="cover-photo"
          fill={true}
          className="object-cover"
        />
        {/* <img
          src={'/images/mobile-profile-banner.svg'}
          alt="cover-photo"
          className="size-full bg-cover bg-no-repeat md:hidden"
        /> */}
      </div>
      <div className="relative mt-[-80px] flex w-full flex-col gap-6 px-[19px] md:mt-[-180px] md:px-[50px] lg:px-[100px]">
        <img
          src={'/images/token-image.png'}
          alt="avatar"
          className="size-20 rounded-lg border-[5px] border-background md:size-[150px]"
        />
        <div className="flex w-full items-center justify-between">
          <h1 className="text-[0.875rem] font-bold md:text-[1.5rem]">Safelaunch_jr</h1>
          <div className="inline-flex items-center gap-3">
            <Button variant={'outline'} className="text-primary hover:text-primary/85">
              <GlobeAltIcon className="size-6" />
            </Button>
            <Button variant={'outline'} className="text-primary hover:text-primary/85">
              <ShareIcon className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      <section className="flex w-full flex-col items-start justify-start gap-10 px-4 md:px-[50px] lg:px-[100px]">
        <p>
          A new era in cryptocurrency, where safety, fairness, and community are at the
          forefront.
        </p>

        <Tabs defaultValue="created" className="w-full">
          <TabsList className="w-full items-start justify-center md:justify-start">
            <TabsTrigger value="created" className="w-full md:w-auto">
              Created
            </TabsTrigger>
            <TabsTrigger value="favorites" className="w-full md:w-auto">
              Favorites
            </TabsTrigger>
          </TabsList>
          <TabsContent value="created">
            <UserTokens user={user} />
          </TabsContent>
          <TabsContent value="favorites">
            <UserLikedTokens user={user} />
          </TabsContent>
        </Tabs>
      </section>
    </Shell>
  );
}

// function TokensCreated({ user }: { user: UserType }) {
//   const { data, isLoading } = useUserTokens(user.unique_id);

//   if (isLoading) {
//     return (
//       <section className="grid grid-cols-2 gap-4 py-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
//         {Array.from({ length: 8 }).map((_, i) => (
//           <div key={i} className="relative rounded md:rounded-lg">
//             <Skeleton key={i} className="h-[117px] rounded-t md:h-[197px] md:rounded-t-lg" />
//             <div className="flex w-full flex-col gap-3 p-2 md:p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex flex-col gap-2">
//                   <Skeleton className="h-[22px] w-[138px] rounded" />
//                   <Skeleton className="h-[22px] w-[138px] rounded" />
//                 </div>
//                 <Skeleton className="h-[22px] w-[34px]" />
//               </div>
//               <Skeleton className="inline-block h-1 w-full rounded" />
//             </div>
//           </div>
//         ))}
//       </section>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center">
//         <p>No coins created</p>
//       </div>
//     );
//   }

//   return (
//     <section className="grid w-full grid-cols-1 gap-4 px-3 py-6 md:grid-cols-2 md:px-0 lg:grid-cols-4 lg:gap-6">
//       {data.tokens.length >= 1 ? (
//         data.tokens.map(token => {
//           const like = data.favorites?.find(favorite => favorite.token_id === token.unique_id);
//           return (
//             <UserTokenCard
//               key={token.unique_id}
//               unique_id={token.unique_id}
//               name={token.name}
//               symbol={token.symbol}
//               image={token.logo_url}
//               user={like?.user}
//               creator_unique_id={token.creator_id}
//               // curve_stats={token?.stats?.curveStats}

//               market_cap={toIntNumberFormat(token?.stats?.marketStats?.marketcapInUsd)}
//             />
//           );
//         })
//       ) : (
//         <div></div>
//       )}
//     </section>
//   );
// }
