'use client';

import { Button } from '@/components/ui/button';
import Form, { useZodForm } from '@/components/ui/form';
import SafeLaunch from '@/contract/safe-launch';
import { SwapTokenInput, swapTokenSchema } from '@/lib/validations/swap-token-schema';
// import { useFormik } from 'formik';
import { STATE_STATUS, Token } from '@/types';
import { ArrowBigDown, LoaderCircle } from 'lucide-react';
import { assetChainTestnet } from 'viem/chains';
import { useAccount, useBalance, useWalletClient } from 'wagmi';
import { createWalletClient, custom } from 'viem';
import { toast } from 'sonner';
import NumberInput from '@/components/number-input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toIntNumberFormat } from '@/lib/utils';
import { Icon } from '@/components/icons';

export function BuyTokenForm({ token }: { token: Token }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const rwaBalance = useBalance({ address });
  console.log({ rwaBalance });
  const [status, setStatus] = useState<STATE_STATUS>(STATE_STATUS.IDLE);
  const [walletClient, setWalletClient] = useState<any>();

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

  const form = useZodForm({
    schema: swapTokenSchema
  });

  async function onSubmit(data: SwapTokenInput) {
    setStatus(STATE_STATUS.LOADING);
    try {
      const formattedAmount = parseFloat(data.amount.replace(/,/g, ''));

      const safeLaunch = new SafeLaunch(walletClient, address);
      const reciept = await safeLaunch.buyToken(
        token?.contract_address,
        String(formattedAmount)
      );
      if (!reciept?.ok) {
        throw new Error(reciept.data);
      } else {
        setStatus(STATE_STATUS.SUCCESS);
        toast.success('Success!', {
          description: `${data.amount} ${token.symbol} purchased successfully.`
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
      className="grid w-full grid-cols-1 gap-6 pt-6"
      disabled={status === STATE_STATUS.LOADING}
    >
      {/* <div className=""> */}
      <div className="flex w-full flex-col items-start justify-center gap-6 rounded border bg-input px-3 py-3.5">
        <div className="flex w-full items-center justify-between">
          <span className="flex font-inter text-[1rem] text-primary">
            {`Balance: ${toIntNumberFormat(Number(rwaBalance?.data?.formatted))}`}
          </span>
          <div className="flex items-center gap-2 rounded-[22px] bg-[#18191E] px-[5px] py-1">
            <Icon.rwaIcon className="size-[25px]" />{' '}
            <span className="text-[1rem] font-light">$RWA</span>
          </div>
        </div>
        <NumberInput
          thousandSeparator=","
          className="flex w-full rounded-lg border border-none bg-input p-0 font-inter text-[1.5rem] font-normal text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#848E9C] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          allowNegative={false}
          placeholder="0.00"
          {...form.register('amount', { required: true })}
        />
      </div>
      <div className="flex w-full items-center justify-between gap-1">
        {[10, 25, 50, 100].map(a => (
          <button
            key={a}
            type={'button'}
            className="whitespace-nowrap rounded bg-card p-2 text-[1rem] font-light text-foreground/[0.50] saturate-200 transition-all ease-in hover:shadow-btn md:px-3"
            onClick={() => form.setValue('amount', `${a}`, { shouldValidate: true })}
          >
            {a} RWA
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between font-inter text-[1rem] text-foreground/[0.50]">
        <span>To received</span>
        <span>0 {token.symbol}</span>
      </div>
      <Button
        type="submit"
        size={'lg'}
        className="w-full"
        disabled={
          !form.formState.isDirty || !form.formState.isValid || status === STATE_STATUS.LOADING
        }
      >
        {status === STATE_STATUS.LOADING ? (
          <LoaderCircle size={20} className="animate-spin" />
        ) : null}
        Buy
      </Button>
    </Form>
  );
}
