'use client';

// import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionTable from './_components/transaction-table';
import BuyAndSellCard from './_components/buy-and-sell-card';

import AddComment from './_components/add-comment';

import { TokenCurveData } from './_components/token-curve-data';
import TokenHeader from './_components/token-header';
import TokenDescription, { TokenSocial } from './_components/token-description';
// import { TokenChart } from './_components/token-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useTokenQuery } from '@/lib/queries';
import Comments from './_components/comment';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

// export async function generateMetadata({
//   params
// }: {
//   params: { id: string };
// }): Promise<Metadata> {
//   // fetch data
//   const token = await fetchSingleToken(params.id);
//   return {
//     title: token?.name,
//     openGraph: {
//       images: [
//         {
//           url: token?.logo_url as string
//         }
//       ],
//       description: `Trade $${token?.symbol} on safelaunch`,
//       type: 'website',
//       title: `SafeLaunch ~ ${token?.name}`,
//       siteName: 'safelaunch-interface.vercel.app',
//       url: `${process.env.NEXT_PUBLIC_APP_CLIENT}/token/${token?.contract_address}`
//     },
//     twitter: {
//       images: [
//         {
//           url: token?.logo_url as string
//         }
//       ],
//       description: `Trade $${token?.symbol} on safelaunch`,
//       title: `Safelaunch ~ ${token?.name}`,
//       site: `${process.env.NEXT_PUBLIC_APP_CLIENT}`,
//       card: 'summary_large_image'
//     }
//   };
// }

interface ITabSection {
  [key: string]: ReactNode;
}

export default function TokenPage({ params }: { params: { id: string } }) {
  const mobileTabs = ['details', 'chart', 'buy/sell'] as const;
  const [mobileTab, setMobileTab] = useState<(typeof mobileTabs)[number]>('details');

  const { data: token, isLoading } = useTokenQuery(params.id);

  if (isLoading) {
    return (
      <Shell className="pt-[160px]">
        <div className="flex-col gap-8 md:flex md:flex-row md:gap-10">
          <div className="flex w-full flex-col gap-10 md:w-3/4">
            <div className="flex w-full flex-col items-start gap-10 rounded border border-border bg-card px-4 py-6">
              <div className="flex flex-col items-start space-y-4 md:flex-row md:space-x-4">
                <Skeleton className="float-none h-[183px] w-full rounded md:size-[183px]" />

                <div className="relative min-w-0 flex-auto space-y-[22px]">
                  <Skeleton className="h-[18px] w-[115px]" />

                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-1 w-full" />
                    <Skeleton className="h-1 w-full" />
                    <Skeleton className="h-1 w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1">
              <Skeleton className="h-[38px] w-full" />
              <Skeleton className="h-[361px] w-full" />
            </div>
            <Skeleton className="h-[292px] w-full" />
          </div>
          <div className="flex w-full flex-col gap-4 md:w-[38%]">
            <Skeleton className="h-[96px] w-full" />
            <div className="flex w-full gap-1">
              <Skeleton className="h-[53px] w-full" />
              <Skeleton className="h-[53px] w-full" />
            </div>
            <Skeleton className="h-[331px] w-full" />
          </div>
        </div>
      </Shell>
    );
  }

  if (!token) {
    return;
  }

  const TokenDetail = () => (
    <>
      <TokenHeader token={token} />
      <TokenSocial token={token} />
      <TokenDescription token={token} />
      <TokenCurveData token={token} />
    </>
  );
  const TokenBuyAndSell = () => (
    <>
      <BuyAndSellCard token={token} />
      <TokenSocial token={token} />
      <div className="flex w-full flex-col items-start gap-6">
        <span className="flex w-full border-b border-primary p-1 px-0 font-inter text-[1rem] font-medium">
          Transactions
        </span>
        <TransactionTable token={token} />
      </div>
    </>
  );

  const TokenChartAndComments = () => (
    <>
      <div className="h-[440px] w-full rounded border border-border bg-card" />
      <div className="w-full space-y-10">
        <Tabs defaultValue="comments">
          <TabsList variant={'centered'}>
            <TabsTrigger variant={'centered'} value="comments">
              Comments
            </TabsTrigger>
            <TabsTrigger variant={'centered'} value="transactions">
              Transactions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="comments">
            <AddComment />
            <Comments tokenId={token.unique_id} />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionTable token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );

  const tabs: ITabSection = {
    details: <TokenDetail />,
    'buy/sell': <TokenBuyAndSell />,
    chart: <TokenChartAndComments />
  };

  return (
    <>
      <Shell className="hidden pt-[110px] md:grid">
        {/* Desktop */}
        <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-[42px] md:grid-cols-[2fr_1fr] md:grid-rows-1">
          <div className="w-full space-y-10">
            <TokenDescription token={token} />
            {/* {priceHistory && <TokenChart history={priceHistory} />} */}

            <div className="h-[440px] w-full rounded border border-border bg-card" />

            <TokenCurveData token={token} />
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                <AddComment />
                <Comments tokenId={token.unique_id} />
              </TabsContent>
              <TabsContent value="transactions">
                <TransactionTable token={token} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="grid gap-6 md:sticky md:top-[110px] md:self-start">
            <TokenHeader token={token} />
            <BuyAndSellCard token={token} />
            <TokenSocial token={token} />
          </div>
        </div>
      </Shell>
      {/* mobile */}
      <div className="block w-full px-0 md:hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={mobileTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Shell variant={'mobile'}>{tabs[mobileTab]}</Shell>
          </motion.div>
        </AnimatePresence>

        <div className="fixed bottom-0 left-0 flex h-fit w-screen items-center justify-between bg-background p-4">
          {mobileTabs.map((tab, index) => (
            <div
              onClick={() => setMobileTab(tab)}
              key={index}
              className={cn(
                'relative flex items-center justify-center px-3.5 py-2.5 text-sm font-bold capitalize transition-colors',
                {
                  'text-primary': tab === mobileTab,
                  'text-[#767676]': tab !== mobileTab
                }
              )}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      {/* <section className="block w-full md:hidden">
        <TokenHeader token={token} favorites={favorites} />

        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="details">
              Details
            </TabsTrigger>
            <TabsTrigger className="w-full" value="buy_sell">
              Buy/Sell
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <section className="space-y-4">
              <TokenDescription token={token} />
              {priceHistory && <TokenChart history={priceHistory} />}

              {token && <TokenCurveData token={token} data={data} />}
              <Tabs defaultValue="comments">
                <TabsList>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                  <AddComment />
                  <section className="grid w-full grid-cols-1 gap-4 py-10">
                    {comments &&
                      comments?.map(comment => {
                        return (
                          <Comment
                            key={comment.unique_id}
                            username={
                              comment.user.username
                                ? comment.user.username
                                : formatAddress(comment.user.wallet_address)
                            }
                            date={formatDateToNow(comment.created_at)}
                            avatar={
                              comment.user.profile_image ??
                              `https://avatar.vercel.sh/${comment.user.username}?size=150`
                            }
                            comment={comment.message}
                          />
                        );
                      })}
                  </section>
                </TabsContent>
                <TabsContent value="transactions">
                  <div className="grid gap-6">
                    <TransactionTable token={token} />
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </TabsContent>
          <TabsContent value="buy_sell">
            <div className="w-full py-4">
              <BuyAndSellCard token={token} />
            </div>
            <TokenStats token={token} data={data} />
          </TabsContent>
        </Tabs>
      </section> */}
    </>
  );
}
