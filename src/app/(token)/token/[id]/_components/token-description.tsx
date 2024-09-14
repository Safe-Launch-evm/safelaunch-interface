import { PlaceholderImage } from '@/components/placeholder-image';
import { SocialIcon, SocialIconType } from '@/components/social-icons';
import { Token } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function TokenDescription({ token }: { token: Token }) {
  const socialLinks = JSON.parse(token.social_links);

  return (
    <div className="my-10 flex flex-col items-start gap-4 self-stretch rounded border border-card-foreground bg-card p-4 md:my-0 md:flex-row">
      {token?.logo_url ? (
        <Image
          src={token.logo_url ?? '/images/token-placeholder.webp'}
          alt={`${token.name}-${token.symbol}`}
          width={150}
          height={150}
          className="size-[150px] rounded border shadow-dip"
          priority
        />
      ) : (
        <PlaceholderImage className="rounded-none" asChild />
      )}

      <div className="flex flex-col gap-6 pt-4">
        <h2 className="text-[1.25rem]/[0.0125rem] font-bold">Description</h2>
        <p className="text-[1.125rem]/[2rem]">{token?.description}</p>
        <div className="flex items-center justify-end gap-6">
          {socialLinks.twitter ? (
            <SocialIconLink href={socialLinks.twitter} icon="xTwitter" name="XTwitter" />
          ) : null}
          {socialLinks.discord ? (
            <SocialIconLink href={socialLinks.discord} icon="discord" name="Discord" />
          ) : null}
          {socialLinks.telegram ? (
            <SocialIconLink href={socialLinks.telegram} icon="telegram" name="Telegram" />
          ) : null}
          {socialLinks.website ? (
            <SocialIconLink href={socialLinks.website} icon="website" name="Website" />
          ) : null}
        </div>
      </div>
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
    <Link href={href} className="transition-colors duration-200 ease-in hover:text-primary">
      <Icon className="size-6" />
      <span className="sr-only">{name}</span>
    </Link>
  );
}
