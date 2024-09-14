import Image from 'next/image';
import Link from 'next/link';

type BannerProps = {
  name: string;
  market_cap: number;
  image: string;
  href: string;
};

export default function Banner({ ...banner }: BannerProps) {
  return (
    <Link href={banner.href}>
      <div className="relative h-[261px] w-[285px] bg-[#E5D4F2] px-4 lg:h-[403px] lg:w-[433px] lg:px-[21px]">
        <Image
          src={banner.image}
          alt={banner.name}
          width={390}
          height={361}
          className="absolute bottom-[100px] h-[230px] w-[250px] border-8 border-[#E9EAED] lg:h-full lg:w-[390px]"
          priority
        />
        <div className="absolute bottom-[13px] flex flex-col items-start justify-start gap-2 pb-[13px]">
          <div className="flex h-[27px] w-[27px] items-center gap-[17px]">
            <dt className="text-[1.25rem]/[1.75rem]">{banner.name}</dt>
            <dd className="flex items-center justify-center rounded bg-primary px-1 py-[2px] text-white">
              SFC
            </dd>
          </div>
          <div className="flex w-full items-center justify-between gap-[22px] lg:w-auto lg:justify-start">
            <dt
              className="flex h-[26px] w-[82px] items-center justify-center bg-no-repeat"
              style={{ backgroundImage: "url('/images/verified.svg')" }}
            >
              <span className="text-[0.875rem]/[1.75rem]">Verified</span>
            </dt>
            <dd className="text-[0.875rem]/[0.00875rem] font-light">
              Market cap: <span className="text-[#6100FF]">{banner.market_cap}k</span>
            </dd>
          </div>
        </div>
      </div>
    </Link>
  );
}
