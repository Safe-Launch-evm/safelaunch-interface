import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { BuyTokenForm } from './buy-token-form';
import { SellTokenForm } from './sell-token-form';

export default function BuyAndSellCard({ token }: { token: any }) {
  return (
    <div className="flex w-full items-center rounded border px-3 py-6 lg:px-[23px]">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList variant={'pill'}>
          <TabsTrigger variant={'pill'} value="buy" className="rounded-r-none border-r-0">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" variant={'pill'} className="rounded-l-none border-l-0">
            Sell
          </TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <BuyTokenForm token={token} />
        </TabsContent>
        <TabsContent value="sell">
          <SellTokenForm token={token} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
