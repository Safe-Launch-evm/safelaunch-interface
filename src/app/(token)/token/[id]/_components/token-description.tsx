/* eslint-disable @next/next/no-img-element */
'use client';
import { SocialIcon, SocialIconType } from '@/components/social-icons';
import { Skeleton } from '@/components/ui/skeleton';
import { useTokenStatsQuery } from '@/lib/queries';
import { toIntNumberFormat } from '@/lib/utils';
import { Token } from '@/types';
import { Share2Icon } from 'lucide-react';
import Link from 'next/link';

export default function TokenDescription({ token }: { token: Token }) {
  const { data: tokenStats, isLoading: isTokenStatsLoading } = useTokenStatsQuery(
    token.unique_id
  );

  return (
    <div className="flex w-full flex-col items-start gap-10 rounded border border-border bg-card px-4 py-6">
      <div className="flex flex-col items-start space-y-4 md:flex-row md:space-x-4">
        <img
          src={'/images/token-image.png'}
          alt={token.symbol}
          className="float-none h-[183px] w-full rounded border border-[#3E3E3E] bg-[#3E3E3E] object-cover md:size-[183px]"
        />

        <div className="relative min-w-0 flex-auto space-y-[22px]">
          <h4>Description</h4>

          <p>{token.description}</p>
        </div>
      </div>
      <dl className="grid w-full grid-cols-2 items-center gap-4 md:flex">
        <TokenStatsCard
          title="Price"
          value={
            isTokenStatsLoading ? (
              <Skeleton className="h-[22px] w-full md:w-[119px]" />
            ) : (
              `${toIntNumberFormat(tokenStats?.marketStats.priceInUsd)} USD`
            )
          }
        />

        <TokenStatsCard
          title="Market cap"
          value={
            isTokenStatsLoading ? (
              <Skeleton className="h-[22px] w-full md:w-[119px]" />
            ) : (
              `${toIntNumberFormat(tokenStats?.marketStats.marketcapInUsd)} USD`
            )
          }
        />

        <TokenStatsCard
          title="Liquidity"
          value={
            isTokenStatsLoading ? (
              <Skeleton className="h-[22px] w-full md:w-[119px]" />
            ) : (
              `${toIntNumberFormat(tokenStats?.marketStats.liquidityInUsd)} USD`
            )
          }
        />

        <TokenStatsCard
          title="Supply"
          value={
            isTokenStatsLoading ? (
              <Skeleton className="h-[22px] w-full md:w-[119px]" />
            ) : (
              `${toIntNumberFormat(tokenStats?.marketStats?.circulatingSupplyInToken)} ${token?.symbol}`
            )
          }
        />
      </dl>
    </div>
  );
}

const TokenStatsCard = ({ title, value }: { title: string; value: any }) => (
  <div className="w-full space-y-4 rounded bg-[#242424] px-3 py-2">
    <dt className="text-[1.125rem]/[1.375rem] font-light text-foreground/[0.5]">{title}</dt>
    <dd className="text-[1.125rem]/[1.375rem] font-medium">{value}</dd>
  </div>
);

export function TokenSocial({ token }: { token: Token }) {
  const socialLinks = JSON.parse(token.social_links);
  return (
    <div className="flex items-center justify-center gap-3 self-stretch rounded border border-border px-[18px] py-3 md:px-6">
      <SocialIconLink href={socialLinks.discord ?? '/'} icon="discord" name="Discord" />
      <SocialIconLink
        href={socialLinks.twitter ?? `/token/${token.unique_id}`}
        icon="xTwitter"
        name="XTwitter"
      />
      <SocialIconLink
        href={socialLinks.telegram ?? `/token/${token.unique_id}`}
        icon="telegram"
        name="Telegram"
      />
      <SocialIconLink
        href={socialLinks.website ?? `/token/${token.unique_id}`}
        icon="website"
        name="Website"
      />
      <button className="rounded-lg border border-border bg-foreground px-[18px] py-2 text-primary-foreground transition-colors duration-200 ease-in hover:text-primary hover:shadow-btn">
        <Share2Icon className="size-6" />
        <span className="sr-only">{'share'}</span>
      </button>
    </div>
  );
}

type IconLink = {
  href: string;
  name: string;
  icon: SocialIconType;
};

function SocialIconLink({ href, name, icon }: IconLink) {
  const Icon = SocialIcon[icon];
  return (
    <Link
      href={href}
      className="rounded-lg border border-border bg-foreground px-[18px] py-2 text-primary-foreground transition-colors duration-200 ease-in hover:text-primary hover:shadow-btn"
    >
      <Icon className="size-6" />
      <span className="sr-only">{name}</span>
    </Link>
  );
}
