'use client';

import { Shell } from '@/components/shell';
import CreateTokenFrom from './_components/create-token-form';

export default function LaunchToken() {
  return (
    <Shell className="justify-center justify-items-center gap-4 py-[100px] md:py-[198px]">
      <CreateTokenFrom />
    </Shell>
  );
}
