'use client';
import { Button } from '@/components/ui/button';
import Form, { useZodForm } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import SafeLaunch from '@/contract/safe-launch';
import { SwapTokenInput, swapTokenSchema } from '@/lib/validations/swap-token-schema';
import { STATE_STATUS, Token } from '@/types';
import { ArrowBigDown, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { assetChainTestnet } from 'viem/chains';
import { useAccount, useWalletClient } from 'wagmi';
import { Hex, createWalletClient, custom } from 'viem';
import { toast } from 'sonner';
import NumberInput from '@/components/number-input';
import { useRouter } from 'next/navigation';
import { getTokenAddress, getTokenBalance } from '@/contract/utils';
import { toIntNumberFormat } from '@/lib/utils';

export function SellTokenForm({ token }: { token: Token }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<STATE_STATUS>(STATE_STATUS.IDLE);

  const [walletClient, setWalletClient] = useState<any>();
  const [tokenBalance, setTokenBalance] = useState<any>();

  // const walletClient = createWalletClient({
  //   account: address,
  //   chain: assetChainTestnet,
  //   transport: window && custom(window?.ethereum!)
  // });

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

    const getData = async () => {
      const tokenAddress = (await getTokenAddress(token.contract_address)) as string;
      const bal = await getTokenBalance(tokenAddress, address as Hex);
      setTokenBalance(bal);
    };

    getData();
  }, []);

  const form = useZodForm({
    schema: swapTokenSchema
  });

  // const formik = useFormik({
  //   initialValues: {
  //     amount: 0
  //   },
  //   onSubmit: async values => {
  //     if (formik.values.amount == 0) throw new Error('Enter an amount.');

  //     const safeLaunch = new SafeLaunch(walletClient, address);
  //     const reciept = await safeLaunch.sellToken(
  //       token?.contract_address as Hex,
  //       String(formik.values.amount)
  //     );

  //     if (!reciept?.ok) {
  //       throw new Error(reciept.data);
  //     } else {
  //       toast.success('Nice!', {
  //         description: `${values.amount} ${token.symbol} purchased successfully.`
  //       });
  //     }
  //   }
  // });

  async function onSubmit(data: SwapTokenInput) {
    setStatus(STATE_STATUS.LOADING);
    try {
      const formattedAmount = parseFloat(data.amount.replace(/,/g, ''));
      const safeLaunch = new SafeLaunch(walletClient, address);
      const reciept = await safeLaunch.sellToken(
        String(formattedAmount),
        token?.contract_address as Hex
      );

      if (!reciept?.ok) {
        throw new Error(reciept.data);
      } else {
        toast.success('Success!', {
          description: `${data.amount} ${token.symbol} sold successfully.`
        });
      }
    } catch (error: any) {
      toast.error('Opps!', { description: error?.message ?? 'An error occurred' });
    } finally {
      form.reset();
      setStatus(STATE_STATUS.IDLE);
      router.refresh();
    }
  }

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid w-full grid-cols-1 gap-6 py-6"
      disabled={status === STATE_STATUS.LOADING}
    >
      <div className="flex w-full flex-col items-start justify-center gap-6 rounded border bg-input px-3 py-3.5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-center gap-2 rounded-[22px] border px-2 py-1">
            <Image
              src={token?.logo_url ?? '/images/token-placeholder.webp'}
              alt="RWA"
              width={22}
              height={22}
              className="pointer-events-none size-[22px] rounded-full"
              priority
            />

            <div className="flex items-center gap-2">
              <span className="text-[1rem]">{token?.symbol}</span>{' '}
            </div>
          </div>
          <span className="flex font-inter text-[1rem] text-primary">
            {tokenBalance && `Balance: ${toIntNumberFormat(Number(tokenBalance))}`}
          </span>
        </div>
        <NumberInput
          thousandSeparator=","
          className="flex w-full rounded-lg border border-none bg-input p-0 font-inter text-[1.5rem] font-normal text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#848E9C] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          allowNegative={false}
          placeholder="0.00"
          {...form.register('amount', { required: true })}
        />
      </div>
      {/* <div className="flex w-full items-center justify-between rounded border bg-input px-2.5 py-2">
        <Input
          placeholder="0.00"
          className="border-none p-0 font-bricolage focus:outline-none"
        />
        <div className="flex w-[70px] items-center justify-center gap-2 rounded-[22px] border border-none bg-white/[0.34] px-2 py-[6px]">
          <Image
            src={token?.logo_url ?? '/images/xend-icon.svg'}
            alt="RWA"
            width={22}
            height={22}
            className="pointer-events-none size-[22px] rounded-full"
            priority
          />
        </div>
      </div> */}
      <Button
        type="submit"
        size={'lg'}
        variant={'destructive'}
        className="w-full"
        disabled={
          !form.formState.isDirty || !form.formState.isValid || status === STATE_STATUS.LOADING
        }
      >
        {status === STATE_STATUS.LOADING ? (
          <LoaderCircle size={20} className="animate-spin" />
        ) : null}
        Sell
      </Button>
    </Form>
  );
}
