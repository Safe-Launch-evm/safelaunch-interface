/* eslint-disable @next/next/no-img-element */
'use client';
import { SocialIcon, SocialIconType } from '@/components/social-icons';
import { Token } from '@/types';
import { Share2Icon } from 'lucide-react';
import Link from 'next/link';

export default function TokenDescription({ token }: { token: Token }) {
  return (
    <div className="flex w-full flex-col items-start gap-10 rounded border border-border bg-card px-4 py-6">
      {/* <div className="grid grid-flow-col grid-rows-3 gap-4">
        <div className="row-span-3 size-[183px]">
          <img
            src={'/images/banner.png'}
            alt={''}
            className="size-[183px] rounded border border-[#3E3E3E] object-cover"
          />
        </div>

        <div className="col-span-2 row-span-2 space-y-[22px]">
          <h4>Description</h4>
          <p>
            Safetoken presents a new era in cryptocurrency, where safety, fairness, and
            community are at the forefront. Join us in building a secure future for all
            digital asset enthusiasts.{' '}
          </p>
        </div>
      </div> */}
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
        <TokenStatsCard title="Price" value="0.000032k TRX" />
        <TokenStatsCard title="Marketcap" value="28.22k" />
        <TokenStatsCard title="Liquidity" value="28.22k" />
        <TokenStatsCard title="Token created" value="28.22k" />
      </dl>
    </div>
  );
}

const TokenStatsCard = ({ title, value }: { title: string; value: string }) => (
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
