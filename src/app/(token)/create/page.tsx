'use client';
import { Shell } from '@/components/shell';
import { CreateTokenFrom } from './_components/create-token-form';

export default function LaunchToken() {
  return (
    <Shell className="justify-center justify-items-center gap-4 py-[150px]">
      <h1 className="text-[1.5rem] font-bold">Create a token </h1>
      <CreateTokenFrom />
    </Shell>
  );
}
