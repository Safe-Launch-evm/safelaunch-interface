'use client';

import { Button } from '@/components/ui/button';
import Form, { useZodForm } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/components/wallet/wallet-connect';
import { addComment } from '@/lib/actions/comment';
import { CommentInput, commentSchema } from '@/lib/validations/profile-schema';
import { STATE_STATUS } from '@/types';
import { LoaderCircle, Smile } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function AddComment() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { isConnected } = useWallet();
  // const [message, setMessage]
  const [showEmojiDialog, setShowEmojiDialog] = useState(false);
  const [status, setStatus] = useState<STATE_STATUS>(STATE_STATUS.IDLE);
  const form = useZodForm({
    schema: commentSchema,
    defaultValues: { message: '' }
  });

  async function onSubmit(data: CommentInput) {
    setStatus(STATE_STATUS.LOADING);
    try {
      const comment = await addComment(params.id, data);
      if (!comment) {
        form.reset();
        setStatus(STATE_STATUS.ERROR);
        toast.error('Error!', { description: 'Please trt again' });
        return;
      }

      setStatus(STATE_STATUS.SUCCESS);
      form.reset();
      router.refresh();
      return;
    } catch (error) {
      form.reset();
      setStatus(STATE_STATUS.ERROR);
      toast.error('Error!', { description: 'Please trt again' });
      return;
    }
  }

  // function addEmoji(e: any) {
  //   const sym = e.unified.split('_');
  //   const codeArray: any = [];
  //   sym.forEach((el: any) => codeArray.push(`0x${el}`));
  //   let emoji = String.fromCodePoint(...codeArray);
  //   form.setValue('message', form.getValues('message') + emoji);
  //   setShowEmojiDialog(false);
  // }

  function addEmoji(emoji: { unified: string }) {
    const codePoints = emoji.unified.split('-').map(u => parseInt(u, 16));
    const emojiChar = String.fromCodePoint(...codePoints);
    form.setValue('message', form.getValues('message') + emojiChar);
    setShowEmojiDialog(false);
  }

  // const custom = [
  //   {
  //     id: 'stickers',
  //     name: 'Stickers',
  //     emojis: [
  //       {
  //         id: `${symbol}`,
  //         name: `${name}`,
  //         keywords: ['stickers'],
  //         skins: [{ src: `${image}` }]
  //       }
  //     ]
  //   }
  // ];

  return (
    <div className="w-full pt-6">
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex w-full flex-col gap-4 rounded-lg border bg-input p-2 focus-within:ring-1 focus-within:ring-ring">
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="resize-none border-0 p-0 shadow-none focus:outline-none focus-visible:ring-0"
            {...form.register('message')}
          />
          <div className="relative flex items-center justify-end gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="hidden rounded-full bg-transparent p-2 transition-colors duration-200 ease-in hover:bg-primary/20 hover:text-primary lg:block"
                onClick={() => setShowEmojiDialog(!showEmojiDialog)}
              >
                <Smile className="size-6" />
              </button>

              {isConnected ? (
                <Button
                  type="submit"
                  size="sm"
                  className="ml-auto gap-1.5"
                  disabled={
                    !form.formState.isDirty ||
                    !form.formState.isValid ||
                    status === STATE_STATUS.LOADING
                  }
                >
                  {status === STATE_STATUS.LOADING && (
                    <LoaderCircle className="size-4 animate-spin" />
                  )}
                  Comment
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => toast.warning('Please Connect your wallet to comment')}
                >
                  Comment
                </Button>
              )}
            </div>
          </div>
          {showEmojiDialog ? (
            <div className="absolute right-0 top-[100%] mt-1">
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                emojiSize={16}
                maxFrequentRows={0}
                // custom={custom}
                // emojiButtonSize={25}
              />
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
