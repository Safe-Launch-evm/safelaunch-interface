'use client';

import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { createWalletClient, custom } from 'viem';
import { assetChainTestnet } from 'viem/chains';
import { Token } from '@/types';
import SafeLaunch from '@/contract/safe-launch';
import { toIntNumberFormat } from '@/lib/utils';

interface iCurveStats {
  currentLiquidity: string;
  targetLiquidity: number;
}
interface iMarketStats {
  price: number;
  circulatingSupply: string;
  marketcap: number;
  liquidity: string;
}

function calcCurvePercent(currentLiquidity: number, targetLiquidity: number): number {
  return (currentLiquidity * 100) / targetLiquidity;
}

const TokenCurveData = ({ token }: { token: Token }) => {
  const { address, isConnected } = useAccount();
  const [curveStats, setCurveStats] = useState<iCurveStats>({
    currentLiquidity: '0',
    targetLiquidity: 0
  });
  const [marketStats, setMarketStats] = useState<iMarketStats>({
    price: 0,
    circulatingSupply: '0',
    marketcap: 0,
    liquidity: '0'
  });

  const walletClient = createWalletClient({
    chain: assetChainTestnet,
    transport: custom(window.ethereum!)
  });

  useEffect(() => {
    if (!walletClient || !token) return;

    const safeLaunch = new SafeLaunch(walletClient, address);
    safeLaunch.getTokenCurveStats(token?.contract_address).then(res => setCurveStats(res));
    safeLaunch.getTokenMarketStats(token?.contract_address).then(res => setMarketStats(res));
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded border border-card-foreground bg-card p-4">
      <h2 className="text-[1.25rem]/[0.0125rem] font-bold">Bonding curve</h2>
      <div className="w-full py-4">
        <Progress
          value={calcCurvePercent(
            Number(curveStats?.currentLiquidity),
            curveStats.targetLiquidity
          )}
        />
      </div>
      <p className="text-[1rem]/[2rem] md:text-[1.125rem]/[2rem]">
        There are{' '}
        <HighlightText value={toIntNumberFormat(Number(marketStats?.circulatingSupply))} />{' '}
        <HighlightText value={token?.symbol} /> available for sale through the bonding curve,
        with the current balance of <HighlightText value={curveStats?.currentLiquidity} /> RWA
        in the curve. As the market cap progresses and reaches{' '}
        <HighlightText value={curveStats?.targetLiquidity} /> RWA, the entire LP tokens in the
        bonding curve will be burned, providing a base liquidity for{' '}
        <HighlightText value={token?.symbol} /> tokens in future.
      </p>
    </div>
  );
};

export default TokenCurveData;

const HighlightText = ({ value }: { value: any }) => (
  <span className="text-accent-200 font-bold">{value}</span>
);

export function TokenStats({ token }: { token: Token }) {
  const { address } = useAccount();

  const [marketStats, setMarketStats] = useState<iMarketStats>({
    price: 0,
    circulatingSupply: '0',
    marketcap: 0,
    liquidity: '0'
  });

  const walletClient = createWalletClient({
    chain: assetChainTestnet,
    transport: custom(window.ethereum!)
  });

  useEffect(() => {
    if (!walletClient || !token) return;

    const safeLaunch = new SafeLaunch(walletClient, address);
    safeLaunch.getTokenMarketStats(token?.contract_address).then(res => setMarketStats(res));
  }, []);

  return (
    <section className="grid w-full grid-cols-2 gap-3">
      <TokenStatsCard
        title="Price"
        value={`${toIntNumberFormat(Number(marketStats.price))} ${token.symbol}`}
      />
      <TokenStatsCard title="Marketcap" value={`${marketStats.marketcap}`} />
      <TokenStatsCard title="Liquidity" value={`${marketStats.liquidity}`} />
      <TokenStatsCard
        title="Circulating Supply"
        value={`${toIntNumberFormat(Number(marketStats?.circulatingSupply))}`}
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
