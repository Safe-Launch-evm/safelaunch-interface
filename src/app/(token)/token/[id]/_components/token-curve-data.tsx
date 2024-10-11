'use client';

import { Progress } from '@/components/ui/progress';
import { Token } from '@/types';
import { toIntNumberFormat } from '@/lib/utils';
import { useTokenStatsQuery } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';

export function calcCurvePercent(currentLiquidity: number, targetLiquidity: number): number {
  return Number((currentLiquidity * 100) / targetLiquidity);
}

export function TokenCurveData({ token }: { token: Token }) {
  const { data: curveData, isLoading: isCurveDatLoading } = useTokenStatsQuery(
    token.unique_id
  );
  return (
    <div className="grid gap-4 rounded border border-border bg-card p-4">
      <h2 className="mt-4 text-[1.25rem]/[0.0125rem] font-bold">Bonding curve</h2>

      <div className="relative mt-4 w-full">
        {isCurveDatLoading ? (
          <Skeleton className="h-3 w-full rounded-lg" />
        ) : (
          <Progress
            value={calcCurvePercent(
              Number(curveData?.curveStats?.currentRwaLiquidity),
              curveData?.curveStats.targetRwaLiquidity
            )}
          />
        )}
      </div>
      <p className="text-[1rem]/[2rem] md:text-[1.125rem]/[2rem]">
        There are{' '}
        {isCurveDatLoading ? (
          <Skeleton className="h-5 w-[84px]" />
        ) : (
          <HighlightText
            value={toIntNumberFormat(Number(curveData?.marketStats?.circulatingSupplyInToken))}
          />
        )}{' '}
        <HighlightText value={token?.symbol} /> available for sale through the bonding curve,
        with the current balance of{' '}
        {isCurveDatLoading ? (
          <Skeleton className="h-5 w-[100px]" />
        ) : (
          <HighlightText
            value={`${toIntNumberFormat(Number(curveData?.curveStats?.currentRwaLiquidity))} RWA`}
          />
        )}{' '}
        in the curve. As the market cap progresses and reaches{' '}
        {isCurveDatLoading ? (
          <Skeleton className="h-5 w-[100px]" />
        ) : (
          <HighlightText value={`${curveData?.curveStats?.targetRwaLiquidity} RWA`} />
        )}
        , the entire LP tokens in the bonding curve will be burned, providing a base liquidity
        for <HighlightText value={token?.symbol} /> tokens in future.
      </p>
    </div>
  );
}

const HighlightText = ({ value }: { value: any }) => (
  <span className="font-bold text-accent-200">{value}</span>
);
