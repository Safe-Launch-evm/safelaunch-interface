import { Progress } from '@/components/ui/progress';
import { Token } from '@/types';
import { toIntNumberFormat } from '@/lib/utils';
// import { fetchTokenStats } from '@/lib/actions/token';

export function calcCurvePercent(currentLiquidity: number, targetLiquidity: number): number {
  return Number((currentLiquidity * 100) / targetLiquidity);
}

export function TokenCurveData({ token, data }: { token: Token; data: any }) {
  // const data = await fetchTokenStats(token.unique_id);

  return (
    <div className="flex flex-col gap-4 rounded border border-card-foreground bg-card p-4">
      <h2 className="text-[1.25rem]/[0.0125rem] font-bold">Bonding curve</h2>
      <div className="w-full py-4">
        <Progress
          value={calcCurvePercent(
            Number(data?.curveStats?.currentRwaLiquidity),
            data?.curveStats.targetRwaLiquidity
          )}
        />
      </div>
      <p className="text-[1rem]/[2rem] md:text-[1.125rem]/[2rem]">
        There are{' '}
        <HighlightText
          value={toIntNumberFormat(Number(data?.marketStats?.circulatingSupplyInToken))}
        />{' '}
        <HighlightText value={token?.symbol} /> available for sale through the bonding curve,
        with the current balance of{' '}
        <HighlightText
          value={toIntNumberFormat(Number(data?.curveStats?.currentRwaLiquidity))}
        />{' '}
        RWA in the curve. As the market cap progresses and reaches{' '}
        <HighlightText value={data?.curveStats?.targetRwaLiquidity} /> RWA, the entire LP
        tokens in the bonding curve will be burned, providing a base liquidity for{' '}
        <HighlightText value={token?.symbol} /> tokens in future.
      </p>
    </div>
  );
}

const HighlightText = ({ value }: { value: any }) => (
  <span className="font-bold text-accent-200">{value}</span>
);

export async function TokenStats({ token, data }: { token: Token; data: any }) {
  return (
    <section className="grid w-full grid-cols-2 gap-3">
      <TokenStatsCard
        title="Price"
        value={`${toIntNumberFormat(data?.marketStats.priceInUsd)} USD`}
      />
      <TokenStatsCard
        title="Marketcap"
        value={`${toIntNumberFormat(data?.marketStats.marketcapInUsd)} USD`}
      />
      <TokenStatsCard
        title="Liquidity"
        value={`${toIntNumberFormat(data?.marketStats.liquidityInUsd)} USD`}
      />
      <TokenStatsCard
        title="Circulating Supply"
        value={`${toIntNumberFormat(data?.marketStats?.circulatingSupplyInToken)} ${token?.symbol}`}
      />
    </section>
  );
}

export function TokenStatsCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="flex flex-col gap-4 border border-card-foreground bg-card p-2">
      <dt className="text-[1rem]/[1.375rem] font-light">{title}</dt>
      <dt className="text-wrap text-[1rem]/[1.375rem] font-medium">{value}</dt>
    </div>
  );
}
