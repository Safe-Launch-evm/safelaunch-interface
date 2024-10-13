'use client';

import FileInput from '@/components/file-input';
import NumberInput from '@/components/number-input';
import { Button } from '@/components/ui/button';
import Form, { useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/components/wallet/wallet-connect';
import { WalletContext } from '@/context/wallet-context';
import { CreateTokenInput, createTokenSchema } from '@/lib/validations/create-token-schema';
import { CloudArrowDownIcon } from '@heroicons/react/24/outline';
import SafeLaunch from '@/contract/safe-launch';
import { assetChainTestnet } from 'viem/chains';
import { createWalletClient, custom } from 'viem';

import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { STATE_STATUS } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { createToken, uploadLogo } from '@/lib/actions/token';
import { toast } from 'sonner';

export default function CreateTokenFrom() {
  const { isConnected, address } = useAccount();
  const { setOpen } = useContext(WalletContext);
  const [status, setStatus] = useState<STATE_STATUS>(STATE_STATUS.IDLE);
  const [walletClient, setWalletClient] = useState<any>();
  const [formInputData, setFormInputData] = useState<any>();

  const form = useZodForm({
    schema: createTokenSchema,
    defaultValues: { contractAddress: address, totalSupply: '1000000000', logoUrl: '' }
  });

  useEffect(() => {
    if (!window.ethereum) {
      console.error('Install browser wallet.');
      return;
    }
    const client = createWalletClient({
      account: address,
      chain: assetChainTestnet,
      transport: window && custom(window?.ethereum!)
    });
    setWalletClient(client);
  }, [address]);

  async function onSubmit(data: CreateTokenInput) {
    setStatus(STATE_STATUS.LOADING);
    const { name, symbol, liquidityAmount } = data;

    const formattedAmount = parseFloat(liquidityAmount.replace(/,/g, ''));
    try {
      let logoUrl = '';

      const formData = new FormData();
      formData.append('image', data.image);
      // formData.append('folder', '');

      const uploaded = await uploadLogo(formData);
      if (uploaded.status !== 201) {
        throw new Error('Image upload failed');
      }
      logoUrl = uploaded.result.url;

      form.setValue('logoUrl', logoUrl);

      const safelaunch = new SafeLaunch(walletClient, address);
      const reciept = await safelaunch.createToken(name, symbol, String(formattedAmount));

      if (!reciept?.ok) throw new Error(reciept.data);

      // console.log('{error}', address, isConnected, reciept);
      form.setValue('contractAddress', reciept.data.log.args.token);

      // Revalidate the form
      await form.trigger();

      const result = await createToken({
        ...data,
        liquidityAmount: String(liquidityAmount)
      });

      if (!result) {
        setStatus(STATE_STATUS.ERROR);
        throw new Error('Creating token failed');
      }
      setFormInputData({ ...data, tokenId: result.result.unique_id });
      // formInputData.tokenId = result.result.unique_id;
      setStatus(STATE_STATUS.SUCCESS);
    } catch (error: any) {
      console.log({ error });
      // setComponent(0);
      setStatus(STATE_STATUS.ERROR);
      toast.error('Opps!', { description: error?.messsage ?? 'An error occurred' });
    }
  }

  if (status === STATE_STATUS.LOADING || status === STATE_STATUS.SUCCESS) {
    return <SuccessLoadingModal loading={status} data={formInputData} />;
  }

  return (
    <section className="w-full border-border px-4 md:w-[518px] md:rounded-lg md:border md:bg-card md:px-8 md:py-10">
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FileInput
          handleFileChange={file => {
            form.setValue('image', file, { shouldValidate: true });
          }}
        />
        <Input
          label="Token name"
          placeholder="Enter name"
          type="text"
          {...form.register('name')}
        />
        <Input
          label="Token symbol "
          placeholder="Symbol"
          type="text"
          {...form.register('symbol')}
        />
        <Textarea
          placeholder="Enter text"
          label="Description"
          helpertext="200 max"
          {...form.register('description')}
        />
        <NumberInput
          label="Supply"
          placeholder="0.0"
          thousandSeparator=","
          {...form.register('liquidityAmount')}
          allowNegative={false}
          className="flex w-full rounded-lg border bg-input p-4 font-inter text-[1.25rem] font-normal text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#848E9C] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Input
          label="Website"
          type="text"
          placeholder="(optional)"
          {...form.register('socialLinks.website')}
        />
        <Input
          label="Discord"
          type="text"
          placeholder="optional"
          {...form.register('socialLinks.discord')}
        />
        <Input
          label="Twitter"
          type="text"
          placeholder="optional"
          {...form.register('socialLinks.twitter')}
        />
        <Input
          label="Telegram"
          placeholder="optional"
          {...form.register('socialLinks.telegram')}
        />
        {isConnected ? (
          <Button
            type="submit"
            fullWidth
            disabled={!form.formState.isDirty || !form.formState.isValid}
          >
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

function SuccessLoadingModal({ loading, data }: { loading: STATE_STATUS; data: any }) {
  return (
    <section className="w-full border-border px-4 md:w-[518px] md:rounded-lg md:border md:bg-card md:px-8 md:py-10">
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <h2 className="text-[1.125rem]/[1.125rem] font-bold">
          {loading === STATE_STATUS.LOADING
            ? `Create ${data?.symbol} on Safelaunch`
            : `${data?.symbol} Successfully Created`}
        </h2>
        {loading === STATE_STATUS.LOADING ? (
          <span className="relative flex size-10 md:size-20">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex size-10 rounded-full bg-primary md:size-20"></span>
          </span>
        ) : (
          <Image
            src={data?.logoUrl}
            alt=""
            width={180}
            height={180}
            className="size-[180px] rounded-full border border-primary"
          />
        )}
        {loading === STATE_STATUS.LOADING ? (
          <span>Creating token ....</span>
        ) : (
          <Button asChild className="text-[1.125rem] font-medium" fullWidth>
            <Link href={`/token/${data.tokenId}`}>View token</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
