import * as React from 'react';

import {
  WalletModalBody,
  WalletModalDescription,
  WalletModalHeader,
  WalletModalTitle
} from '@/components/wallet/wallet-modal';
import { useAccount } from 'wagmi';
import { WalletContext } from '@/context/wallet-context';
import { STATE_STATUS } from '@/types';
import Form, { useZodForm } from '../ui/form';
import { ProfileInput, profileSchema } from '@/lib/validations/profile-schema';
import { uploadLogo } from '@/lib/actions/token';
import { registerUser } from '@/lib/actions/user';
import { toast } from 'sonner';
import Image from 'next/image';
import { CircleX, Delete, ImagePlus, LoaderCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { truncate } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { BackChevron } from './wallet-connect';
import FileInput from '../file-input';

type ImageProps = {
  url: string;
  image: string;
};

export default function RegisterUserForm() {
  const { address } = useAccount();
  const context = React.useContext(WalletContext);
  const [status, setStatus] = React.useState<STATE_STATUS>(STATE_STATUS.IDLE);

  const form = useZodForm({
    schema: profileSchema,
    defaultValues: {
      walletAddress: address
    }
  });

  // async function onSubmit(data: ProfileInput) {
  //   setStatus(STATE_STATUS.LOADING);
  //   try {

  //     if (data.image !== null) {
  //       const formData = new FormData();
  //       formData.append('image', data.image as any);
  //       formData.append('folder', 'avatar');
  //       const uploaded = await uploadLogo(formData);
  //       if (uploaded.status !== 201) {
  //         setStatus(STATE_STATUS.ERROR);
  //         toast.error('Opps!', { description: 'An error occurred' });
  //         return;
  //       }
  //       const result = await registerUser({  profileImage: uploaded.result.url, ...data });
  //       if (!result) {
  //         setStatus(STATE_STATUS.ERROR);
  //         toast.error('Opps!', { description: 'An error occurred' });
  //         return;
  //       }
  //     }

  //     const result = await registerUser({ profileImage: `https://avatar.vercel.sh/${address}?size=150`, ...data });
  //     if (!result) {
  //       setStatus(STATE_STATUS.ERROR);
  //       toast.error('Opps!', { description: 'An error occurred' });
  //       return;
  //     }
  //     toast.success('Success', { description: 'User profile updated' });
  //     setStatus(STATE_STATUS.SUCCESS);
  //     context.setOpenAuthDialog(false);
  //   } catch (error) {
  //     setStatus(STATE_STATUS.ERROR);
  //     toast.error('Opps!', { description: 'An error occurred' });
  //     return;
  //   }
  // }

  async function onSubmit(data: ProfileInput) {
    setStatus(STATE_STATUS.LOADING);
    try {
      let profileImage = `https://avatar.vercel.sh/${address}?size=150`;

      if (data.image) {
        const formData = new FormData();
        formData.append('image', data.image);
        formData.append('folder', 'avatar');

        const uploaded = await uploadLogo(formData);
        if (uploaded.status !== 201) {
          throw new Error('Image upload failed');
        }
        profileImage = uploaded.result.url;
      }

      const result = await registerUser({ ...data, profileImage });
      if (!result) {
        throw new Error('User registration failed');
      }

      toast.success('Success', { description: 'User profile updated' });
      setStatus(STATE_STATUS.SUCCESS);
      context.setOpenAuthDialog(false);
    } catch (error) {
      setStatus(STATE_STATUS.ERROR);
      toast.error('Oops!', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }

  return (
    <>
      <WalletModalHeader>
        <BackChevron />
        <WalletModalTitle>Setup profile</WalletModalTitle>
        <WalletModalDescription className="sr-only">
          {' '}
          Profile modal to edit profile.
        </WalletModalDescription>
      </WalletModalHeader>
      <WalletModalBody className="h-full">
        <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="w-full gap-4">
          <div className="flex w-full items-center justify-center">
            <FileInput
              variant={'profile'}
              disabled={status === STATE_STATUS.LOADING}
              handleFileChange={file => form.setValue('image', file, { shouldValidate: true })}
            />
          </div>

          <Input label="Username" placeholder="Enter name" {...form.register('username')} />
          <Input label="Telegram" placeholder="tg handle" {...form.register('telegram')} />
          <Textarea
            placeholder="Description"
            label="Enter text"
            helpertext="max 200"
            {...form.register('bio')}
          />
          <div className="flex items-center justify-end gap-4 py-4">
            <Button
              type="button"
              variant={'ghost'}
              size={'sm'}
              className="text-foreground"
              onClick={() => context.setOpenAuthDialog(false)}
            >
              Skip
            </Button>
            <Button type={'submit'} size={'sm'} disabled={status === STATE_STATUS.LOADING}>
              {status === STATE_STATUS.LOADING ? <LoaderCircle size={20} /> : null}
              Save
            </Button>
          </div>
        </Form>
      </WalletModalBody>
    </>
  );
}
