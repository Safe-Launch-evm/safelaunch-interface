'use client';

import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Form, { useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConnectWalletButton } from '@/components/wallet/wallet-connect';
import { handleDelete } from '@/config/cloud';
import { WalletContext } from '@/context/wallet-context';
import { createToken, uploadLogo } from '@/lib/actions/token';
import client from '@/lib/client';
import { formatBytes, truncate } from '@/lib/utils';
import { CreateTokenInput, createTokenSchema } from '@/lib/validations/create-token-schema';
import { STATE_STATUS } from '@/types';
import {
  ChevronLeft,
  Circle,
  CircleX,
  Delete,
  FileImage,
  ImagePlus,
  LoaderCircle,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAccount, useChainId, useConnections, useWalletClient } from 'wagmi';
import { SuccessTokenCreated, TokenRWA } from './utils';
import SafeLaunch from '@/contract/safe-launch';
import { assetChainTestnet } from 'viem/chains';
import { config } from '@/lib/wagmi-config';
import { createPublicClient, createWalletClient, http, custom, getContract } from 'viem';

interface FormSectionProps {
  [key: string]: React.ReactNode;
}

type ImageProps = {
  url: string;
  image: string;
};

export const CreateTokenFrom = () => {
  const { address, isConnected } = useAccount();
  const { pendingConnector } = React.useContext(WalletContext);
  const [status, setStatus] = React.useState(STATE_STATUS.IDLE);
  const [uploadStatus, setUploadStatus] = React.useState(STATE_STATUS.IDLE);
  const [isPending, startTransition] = React.useTransition();
  const [component, setComponent] = React.useState<number>(0);
  const [imageSrc, setImageSrc] = React.useState<ImageProps | null>(null);
  const [formInputData, setFormInputData] = React.useState<any>();
  const [walletClient, setWalletClient] = React.useState<any>();

  const form = useZodForm({
    schema: createTokenSchema,
    defaultValues: { contractAddress: address, totalSupply: '1000000000' }
  });

  const { setValue } = form;

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
  }, []);

  useEffect(() => {
    if (imageSrc) setValue('logoUrl', imageSrc.url);
  }, [imageSrc]);

  function AddTokenForm() {
    function onSubmit(data: CreateTokenInput) {
      setFormInputData(data);
      if (imageSrc?.url) setComponent(1);
    }

    async function onUpload(formData: any) {
      setUploadStatus(STATE_STATUS.LOADING);
      try {
        const uploaded = await uploadLogo(formData);

        if (uploaded.status === 201) {
          setImageSrc(uploaded.result);
          setUploadStatus(STATE_STATUS.SUCCESS);
          toast.success('Nice!', { description: 'Image uploaded.' });
        } else {
          setImageSrc(null);
          setUploadStatus(STATE_STATUS.ERROR);
          toast.error('Opps!', { description: 'Image upload failed.' });
        }
      } catch (error) {
        setImageSrc(null);
        setUploadStatus(STATE_STATUS.ERROR);
      }
    }

    async function onDeleteImage() {
      if (imageSrc) {
        await handleDelete(imageSrc.image);
      }
    }
    return (
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="md:w-[570px]">
        <div className="flex flex-col gap-2 px-8 pt-6 text-[1.125rem]/[1.125rem]">
          <span>Image</span>

          <div className="flex items-center justify-center gap-4 pr-4">
            <label
              htmlFor="file-upload"
              className="relative flex size-[64px] cursor-pointer items-center justify-center rounded-lg border disabled:cursor-not-allowed"
            >
              {imageSrc ? (
                <Image
                  src={imageSrc.url}
                  alt="pre image uplod"
                  width={64}
                  height={64}
                  className="size-[64px] rounded-lg bg-cover bg-center bg-no-repeat"
                />
              ) : (
                <>
                  {uploadStatus === STATE_STATUS.LOADING ? (
                    <LoaderCircle size={35} className="animate-spin" />
                  ) : uploadStatus === STATE_STATUS.ERROR ? (
                    <CircleX size={35} />
                  ) : (
                    <ImagePlus size={35} />
                  )}
                </>
              )}
              <Input
                id="file-upload"
                type="file"
                className="sr-only"
                disabled={!isConnected}
                {...form.register('image')}
                onChange={(e: any) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
                    onUpload(formData);
                  }
                }}
              />
              {imageSrc ? (
                <Button
                  size="icon"
                  variant="secondary"
                  className="group absolute -bottom-2 -right-2 rounded-full bg-muted p-1.5 shadow"
                  onClick={onDeleteImage}
                >
                  <Delete className="size-4 transition-transform" />
                </Button>
              ) : null}
            </label>
            <div className="flex flex-col gap-1 text-[1.125rem]">
              <span> {imageSrc ? truncate(imageSrc.image, 32) : 'PNG, JPEG, max 5MB'}</span>
            </div>
          </div>
        </div>

        <div className="w-full border-b border-border" />

        <div className="flex w-full flex-col gap-6 px-8 py-6">
          <Input label="Token name" placeholder="Enter name" {...form.register('name')} />
          <Input label="Token symbol" placeholder="Symbol" {...form.register('symbol')} />
          <Textarea
            placeholder="Enter text"
            label="Description"
            helpertext="200 max"
            {...form.register('description')}
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
        </div>
        <div className="flex w-full items-center justify-center px-8 py-6">
          {isConnected ? (
            <Button type="submit" fullWidth>
              Create Token
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </Form>
    );
  }

  function AddLiquidity() {
    async function handleClick() {
      setComponent(0);
    }

    async function onSubmit(data: CreateTokenInput) {
      setStatus(STATE_STATUS.LOADING);
      const { name, symbol, liquidityAmount } = data;

      try {
        // if (!walletClient) return;
        if (!liquidityAmount) throw new Error('Add liquidity to token');

        const safelaunch = new SafeLaunch(walletClient, address);
        const reciept = await safelaunch.createToken(name, symbol, liquidityAmount);

        if (!reciept?.ok) throw new Error(reciept.data);

        // console.log('{error}', address, isConnected, reciept);
        data.contractAddress = reciept.data.log.args.token;

        const result = await createToken(data);
        formInputData.tokenId = result.result.unique_id;

        if (!result) {
          setStatus(STATE_STATUS.ERROR);
          throw new Error('Creating token failed');
        }

        setStatus(STATE_STATUS.SUCCESS);
      } catch (error: any) {
        // console.log({ error });
        setComponent(0);
        setStatus(STATE_STATUS.ERROR);
        toast.error('Opps!', { description: error?.messsage ?? 'An error occurred' });
      }
    }

    return (
      <div className="relative flex w-full flex-col items-center justify-center gap-10 px-8 py-6">
        <button
          className="absolute left-[32px] top-[26px] z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground md:top-[26px]"
          onClick={handleClick}
        >
          <ChevronLeft className="size-6" />
          <span className="sr-only">Cancel connection</span>
        </button>
        <h2 className="pt-4 text-[1.25rem]/[0.0125rem] font-bold">Add liquidity</h2>
        <p className="text-center text-[1.125rem]/[1.125rem]">
          Buying a small amount of coins helps protect your coin from snipers. This is optional
        </p>

        <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex w-full flex-col gap-3 rounded-lg border bg-input px-2.5 py-3.5">
            <div className="flex justify-end">
              <TokenRWA />
            </div>
            <Input
              className="border-none px-0 py-3 focus:outline-none"
              placeholder="0.00 RWA"
              {...form.register('liquidityAmount')}
            />
          </div>
          <div className="flex w-full items-center justify-center py-6">
            <Button
              fullWidth
              disabled={
                !form.formState.isDirty ||
                !form.formState.isValid ||
                status === STATE_STATUS.LOADING
              }
            >
              {status === STATE_STATUS.LOADING ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : null}
              Launch Token
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  const components: FormSectionProps = {
    0: <AddTokenForm />,
    1: <AddLiquidity />
  };

  return (
    <div className="max-w-[570px] gap-10 rounded-lg border bg-card-200">
      {status === STATE_STATUS.SUCCESS ? (
        <SuccessTokenCreated formData={formInputData} />
      ) : (
        components[component]
      )}
    </div>
  );
};
