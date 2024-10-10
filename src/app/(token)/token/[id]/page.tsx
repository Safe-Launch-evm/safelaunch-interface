import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionTable from './_components/transaction-table';
import Comment from './_components/comment';
import BuyAndSellCard from './_components/buy-and-sell-card';
import {
  fetchSingleToken,
  fetchTokenPriceHistory,
  fetchTokens,
  fetchTokenStats
} from '@/lib/actions/token';
import AddComment from './_components/add-comment';
import { fetchTokenComments } from '@/lib/actions/comment';
import { formatAddress, formatDate, formatDateToNow, formatPrice } from '@/lib/utils';
import { TokenCurveData, TokenStats } from './_components/token-curve-data';
import TokenHeader from './_components/token-header';
import TokenDescription, { TokenSocial } from './_components/token-description';
import { TokenChart } from './_components/token-chart';

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  // fetch data
  const token = await fetchSingleToken(params.id);
  return {
    title: token?.name,
    openGraph: {
      images: [
        {
          url: token?.logo_url as string
        }
      ],
      description: `Trade $${token?.symbol} on safelaunch`,
      type: 'website',
      title: `SafeLaunch ~ ${token?.name}`,
      siteName: 'safelaunch-interface.vercel.app',
      url: `${process.env.NEXT_PUBLIC_APP_CLIENT}/token/${token?.contract_address}`
    },
    twitter: {
      images: [
        {
          url: token?.logo_url as string
        }
      ],
      description: `Trade $${token?.symbol} on safelaunch`,
      title: `Safelaunch ~ ${token?.name}`,
      site: `${process.env.NEXT_PUBLIC_APP_CLIENT}`,
      card: 'summary_large_image'
    }
  };
}

export default async function TokenPage({ params }: { params: { id: string } }) {
  const token = await fetchSingleToken(params.id);
  const comments = await fetchTokenComments(params.id);
  if (!token) return;

  const data = await fetchTokenStats(token.unique_id);
  const priceHistory = await fetchTokenPriceHistory(token.unique_id);
  // console.log({priceHistory})
  const { favorites } = await fetchTokens({ favorites: true });

  return (
    <Shell className="pt-[110px]">
      {/* Desktop */}
      <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-[42px] md:grid-cols-[2fr_1fr] md:grid-rows-1">
        <div className="w-full space-y-10">
          <TokenDescription token={token} />
          {/* {priceHistory && <TokenChart history={priceHistory} />} */}

          <div className="h-[440px] w-full rounded border border-border bg-card" />

          {token && <TokenCurveData token={token} data={data} />}
          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <AddComment />
              <section className="flex flex-col gap-4 py-10">
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
              <TransactionTable token={token} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="sticky grid gap-6 self-start md:top-[110px]">
          <TokenHeader token={token} favorites={favorites} />
          <BuyAndSellCard token={token} />
          <TokenSocial token={token} />
          {/* <TokenStats token={token} data={data} /> */}
        </div>
      </div>
      {/* mobile */}
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
    </Shell>
  );
}
