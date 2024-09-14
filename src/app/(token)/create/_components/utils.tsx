import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const SuccessTokenCreated = (tokenInputData: any) => {
  const { formData } = tokenInputData;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-2 py-6 md:w-[300px]">
      <h2 className="text-[1.125rem]/[1.125rem] font-bold">
        {formData.symbol} Successfully Launched
      </h2>
      <Image
        src={formData?.logoUrl}
        alt=""
        width={185}
        height={140}
        className="size-[180px] rounded"
      />
      <Button asChild className="text-[1.125rem] font-medium">
        <Link href={`/token/${formData.tokenId}`}>View token</Link>
      </Button>
    </div>
  );
};

export const TokenRWA = () => (
  <div className="flex items-center justify-center gap-2 rounded-[22px] border px-2 py-1">
    <Image
      src={'/images/xend-icon.svg'}
      alt="RWA"
      width={22}
      height={22}
      className="pointer-events-none size-[22px] rounded-full"
      priority
    />

    <div className="flex items-center gap-2">
      <span className="text-[1rem]">RWA</span> <Icon.arrowDown className="size-3.5" />
    </div>
  </div>
);
