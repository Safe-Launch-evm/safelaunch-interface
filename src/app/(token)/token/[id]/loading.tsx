import { Shell } from '@/components/shell';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  return (
    <Shell className="pt-[160px]">
      <div className="flex-col gap-8 md:flex md:flex-row md:gap-10">
        <div className="flex w-full flex-col gap-10 md:w-3/4">
          <Skeleton className="h-[245px] w-full" />
          <div className="flex w-full flex-col gap-1">
            <Skeleton className="h-[38px] w-full" />
            <Skeleton className="h-[361px] w-full" />
          </div>
          <Skeleton className="h-[292px] w-full" />
        </div>
        <div className="flex w-full flex-col gap-4 md:w-[38%]">
          <Skeleton className="h-[96px] w-full" />
          <div className="flex w-full gap-1">
            <Skeleton className="h-[53px] w-full" />
            <Skeleton className="h-[53px] w-full" />
          </div>
          <Skeleton className="h-[331px] w-full" />
        </div>
      </div>
    </Shell>
  );
}
