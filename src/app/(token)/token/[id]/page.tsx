import { Shell } from '@/components/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionTable from './_components/transaction-table';
import Comment from './_components/comment';
import BuyAndSellCard from './_components/buy-and-sell-card';
import {
  fetchSingleToken,
  fetchTokenPriceHistory,
  fetchTokenStats
} from '@/lib/actions/token';
import AddComment from './_components/add-comment';
import { fetchTokenComments } from '@/lib/actions/comment';
import { _formatAddress, formatAddress, formatDateToNow } from '@/lib/utils';
import { TokenCurveData, TokenStats } from './_components/token-curve-data';
import TokenHeader from './_components/token-header';
import TokenDescription from './_components/token-description';
import { TokenChart } from './_components/token-chart';

export default async function TokenPage({ params }: { params: { id: string } }) {
  const token = await fetchSingleToken(params.id);

  const comments = await fetchTokenComments(params.id);

  if (!token) return;

  const data = await fetchTokenStats(token.unique_id);
  const priceHistory = await fetchTokenPriceHistory(token.unique_id);

  return (
    <Shell className="pt-[160px]">
      {/* Desktop */}
      <div className="hidden flex-col gap-8 md:flex md:flex-row md:gap-10">
        <div className="flex w-full flex-col gap-10 md:w-3/4">
          <TokenDescription token={token} />
          {/* <div className="h-[361px] w-full rounded bg-card-foreground" /> */}
          {priceHistory && <TokenChart history={priceHistory} />}

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

        <div className="flex w-full flex-col gap-4 md:w-[38%]">
          <TokenHeader token={token} />
          <BuyAndSellCard token={token} />
          <TokenStats data={data} />
        </div>
      </div>
      {/* mobile */}
      <section className="block w-full md:hidden">
        <TokenHeader token={token} />

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
            <div className="flex w-full flex-col gap-10">
              <TokenDescription token={token} />
              <div className="h-[361px] w-full rounded bg-card-foreground" />

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
          </TabsContent>
          <TabsContent value="buy_sell">
            <div className="w-full py-4">
              <BuyAndSellCard token={token} />
            </div>
            <TokenStats data={data} />
          </TabsContent>
        </Tabs>
      </section>
    </Shell>
  );
}
