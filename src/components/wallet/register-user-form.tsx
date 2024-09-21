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

type ImageProps = {
  url: string;
  image: string;
};

export default function RegisterUserForm() {
  const { address } = useAccount();
  const context = React.useContext(WalletContext);
  const [status, setStatus] = React.useState<STATE_STATUS>(STATE_STATUS.IDLE);
  const [uploadStatus, setUploadStatus] = React.useState(STATE_STATUS.IDLE);
  const [imageSrc, setImageSrc] = React.useState<ImageProps | null>(null);

  const form = useZodForm({
    schema: profileSchema,
    defaultValues: {
      walletAddress: address,
      profileImage: `https://avatar.vercel.sh/${address}?size=150`
    }
  });

  const { setValue } = form;

  React.useEffect(() => {
    if (imageSrc) {
      setValue('profileImage', imageSrc.url);
    }
  }, [imageSrc, setValue]);

  async function onUpload(formData: any) {
    setUploadStatus(STATE_STATUS.LOADING);
    try {
      const uploaded = await uploadLogo(formData);
      if (uploaded.status !== 201) {
        setImageSrc(null);
        setUploadStatus(STATE_STATUS.ERROR);
      }
      setImageSrc(uploaded.result);
      setUploadStatus(STATE_STATUS.SUCCESS);
    } catch (error) {
      setImageSrc(null);
      setUploadStatus(STATE_STATUS.ERROR);
    }
  }

  async function onSubmit(data: ProfileInput) {
    setStatus(STATE_STATUS.LOADING);
    try {
      const result = await registerUser(data);
      if (!result) {
        setStatus(STATE_STATUS.ERROR);
        toast.error('Opps!', { description: 'An error occurred' });
        return;
      }
      toast.error('Success', { description: 'User profile updated' });
      setStatus(STATE_STATUS.SUCCESS);
      context.setOpenAuthDialog(false);
    } catch (error) {
      setStatus(STATE_STATUS.ERROR);
      toast.error('Opps!', { description: 'An error occurred' });
      return;
    }
  }

  return (
    <>
      <WalletModalHeader>
        <BackChevron />
        <WalletModalTitle className="text-left">Setup profile</WalletModalTitle>
        <WalletModalDescription className="sr-only">
          {' '}
          Profile modal to edit profile.
        </WalletModalDescription>
      </WalletModalHeader>
      <WalletModalBody className="h-[400px] max-h-[500px]">
        <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="w-full px-4">
          <div className="flex flex-col gap-2 px-4 pt-6 text-[1.125rem]/[1.125rem]">
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
                  disabled={uploadStatus === STATE_STATUS.LOADING}
                  {...form.register('image')}
                  onChange={(e: any) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('image', file);
                      formData.append('folder', 'avatar');
                      onUpload(formData);
                    }
                  }}
                />
                {imageSrc ? (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="group absolute -bottom-2 -right-2 rounded-full bg-muted p-1.5 shadow"
                    // onClick={onDeleteImage}
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

          <div className="flex w-full flex-col gap-6">
            <Input label="Username" placeholder="E.g: GG" {...form.register('username')} />
            <Textarea placeholder="Enter text" label="Bio" {...form.register('bio')} />
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
          </div>
        </Form>
      </WalletModalBody>
    </>
  );
}
