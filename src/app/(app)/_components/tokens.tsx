// 'use client';

// import TokenCard from '@/components/cards/token-card';
// import { Skeleton } from '@/components/ui/skeleton';
// import { fetchTokens } from '@/lib/actions/token';

// import { formatAddress, toIntNumberFormat } from '@/lib/utils';
// import { Token, TokenLike } from '@/types';
// import { useQuery } from '@tanstack/react-query';
// import { useAccount } from 'wagmi';

// type TokenResult = {
//   favorites: TokenLike[] | null;
//   tokens: Token[] | null;
// };

// type TokensProps = {
//   currentTab: string;
//   searchParams: { tab: string; search: string };
// };

// export default function Tokens({ currentTab, searchParams }: TokensProps) {
//   const { isConnected } = useAccount();
//   const favorites = currentTab === 'favorites' ? true : false;
//   const trending = currentTab === 'trending' ? true : false;

//   // const { data, isLoading, isPending } = useQuery({
//   //   queryKey: ['tokens', { favorites, trending, search: searchParams.search }],
//   //   queryFn: () =>
//   //     fetchTokens({
//   //       favorites,
//   //       trending,
//   //       search: searchParams.search
//   //     })
//   // });

//   // const {
//   //   data: userTokens,
//   //   isLoading: isLikesLoading,
//   //   isPending: isLikesPending
//   // } = useQuery({
//   //   queryKey: ['userTokens'],
//   //   queryFn: () =>
//   //     fetchTokens({
//   //       favorites: isConnected
//   //     })
//   // });

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['tokens', { favorites, trending, search: searchParams.search }],
//     queryFn: () => fetchTokens({ favorites, trending, search: searchParams.search }),
//     staleTime: 60000 // Consider caching the result for 1 minute
//   });

//   const {
//     data: userTokens,
//     isLoading: isLikesLoading,
//     error: userTokensError
//   } = useQuery({
//     queryKey: ['userTokens', isConnected],
//     queryFn: () => fetchTokens({ favorites: false }),
//     enabled: isConnected,
//     staleTime: 60000 // Consider caching the result for 1 minute
//   });

//   if (isLoading || isLikesLoading) {
//     return (
//       <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
//         {Array.from({ length: 8 }).map((_, i) => (
//           <div key={i} className="relative rounded md:rounded-lg">
//             <Skeleton key={i} className="h-[117px] rounded-t md:h-[197px] md:rounded-t-lg" />
//             <div className="w-full bg-card p-2 md:p-4">
//               <div className="grid grid-cols-[3fr_1fr] items-center gap-2">
//                 <div>
//                   <Skeleton className="h-[22px] w-[138px] rounded" />
//                   <Skeleton className="h-[22px] w-[138px] rounded" />
//                 </div>
//                 <div>
//                   <Skeleton className="h-[22px] w-[34px]" />
//                 </div>
//               </div>
//               <div className="flex gap-1 py-2">
//                 <span className="inline-block h-1 w-full rounded" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   const { favorites: likes, tokens } = data ?? {};
//   const { favorites: userLikes } = userTokens ?? {};

//   return (
//     <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
//       {tokens ? (
//         <>
//           {tokens.length >= 1 ? (
//             tokens.map(token => {
//               const like = userLikes?.find(favorite => favorite.token_id === token.unique_id);
//               return (
//                 <TokenCard
//                   key={token.unique_id}
//                   unique_id={token.unique_id}
//                   name={token.name}
//                   symbol={token.symbol}
//                   image={token.logo_url}
//                   creator_unique_id={token.creator.unique_id}
//                   user={like?.user}
//                   owner={
//                     token.creator.username
//                       ? token.creator.username
//                       : formatAddress(token.creator.wallet_address)
//                   }
//                   market_cap={toIntNumberFormat(token?.stats?.marketStats?.marketcapInUsd)}
//                 />
//               );
//             })
//           ) : (
//             <div></div>
//           )}
//         </>
//       ) : null}
//       {likes ? (
//         <>
//           {likes?.length >= 1 ? (
//             likes?.map(favorite => {
//               return (
//                 <TokenCard
//                   key={favorite?.unique_id}
//                   unique_id={favorite?.token_id}
//                   name={favorite?.token.name}
//                   symbol={favorite?.token.symbol}
//                   image={favorite?.token.logo_url}
//                   creator_unique_id={favorite?.token.creator_id}
//                   user={favorite?.user}
//                   market_cap={0}
//                 />
//               );
//             })
//           ) : (
//             <div></div>
//           )}
//         </>
//       ) : null}
//     </div>
//   );
// }
