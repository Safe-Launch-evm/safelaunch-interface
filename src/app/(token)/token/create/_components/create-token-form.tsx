'use client';

import FileInput from '@/components/file-input';
import NumberInput from '@/components/number-input';
import { Button } from '@/components/ui/button';
import Form, { useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/components/wallet/wallet-connect';
import { WalletContext } from '@/context/wallet-context';
import { createTokenSchema } from '@/lib/validations/create-token-schema';
import { CloudArrowDownIcon } from '@heroicons/react/24/outline';

import { useContext } from 'react';
import { useAccount } from 'wagmi';

export default function CreateTokenFrom() {
  const { isConnected } = useAccount();
  const { setOpen } = useContext(WalletContext);

  const form = useZodForm({
    schema: createTokenSchema,
    defaultValues: { contractAddress: 'fffffffff', totalSupply: '1000000000' }
  });

  return (
    <section className="w-full border-border px-4 md:w-[518px] md:rounded-lg md:border md:bg-card md:px-8 md:py-10">
      <Form form={form} className="w-full">
        <FileInput
          handleFileChange={file => {
            form.setValue('image', file);
          }}
        />
        <Input label="Token name" placeholder="Enter name" {...form.register('name')} />
        <Input label="Token symbol " placeholder="Symbol" {...form.register('name')} />
        <Textarea
          placeholder="Enter text"
          label="Description"
          helpertext="200 max"
          {...form.register('description')}
        />
        <NumberInput
          label="Supply"
          placeholder="0.0"
          {...form.register('liquidityAmount')}
          className="flex w-full rounded-lg border bg-input p-4 font-inter text-[1.25rem] font-normal text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#848E9C] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Input
          label="Website"
          placeholder="(optional)"
          {...form.register('socialLinks.website')}
        />
        <Input
          label="Discord"
          placeholder="optional"
          {...form.register('socialLinks.discord')}
        />
        <Input
          label="Twitter"
          placeholder="optional"
          {...form.register('socialLinks.twitter')}
        />
        <Input
          label="Telegram"
          placeholder="optional"
          {...form.register('socialLinks.telegram')}
        />
        {isConnected ? (
          <Button type="submit" fullWidth>
            Create Token
          </Button>
        ) : (
          <Button type="button" fullWidth onClick={() => setOpen(true)}>
            Connect wallet
          </Button>
        )}
      </Form>
    </section>
  );
}
