'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommentsQuery } from '@/lib/queries';
import { formatAddress, formatDateToNow } from '@/lib/utils';
import { CornerUpLeft, Heart } from 'lucide-react';
import Image from 'next/image';

type CommentProps = {
  username: string;
  date: string;
  avatar: string;
  comment: string;
};

export default function Comments({ tokenId }: { tokenId: string }) {
  const { data: comments, isLoading } = useCommentsQuery(tokenId);

  if (isLoading) {
    <section className="flex flex-col gap-4 py-10">
      <div className="flex w-full flex-col items-start gap-4 self-stretch p-2 lg:p-4">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-5 w-full" />
      </div>
    </section>;
  }

  return (
    <section className="flex flex-col gap-4 py-10">
      {comments &&
        comments?.map(comment => {
          return (
            <Comment
              key={comment.unique_id}
              username={
                comment.user.username
                  ? comment.user.username
                  : formatAddress(comment.user.wallet_address)
              }
              date={formatDateToNow(comment.created_at)}
              avatar={
                comment.user.profile_image ??
                `https://avatar.vercel.sh/${comment.user.username}?size=150`
              }
              comment={comment.message}
            />
          );
        })}
    </section>
  );
}

function Comment({ ...item }: CommentProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch border-b border-border p-2 lg:p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={item.avatar}
            alt=""
            width={40}
            height={40}
            className="size-6 shrink-0 rounded-full lg:size-10"
            priority
          />

          <span className="flex items-center justify-center rounded bg-primary px-2 py-[2px]">
            {item.username}
          </span>
          <span className="font-light text-muted">{item.date}</span>
        </div>
        {/* <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-light">
            <Heart size={24} /> <span className="text-muted">8</span>
          </div>
          <div className="flex items-center gap-2 font-light">
            <span className="text-muted">reply</span> <CornerUpLeft size={24} />
          </div>
        </div> */}
      </div>
      <p className="hyphens-auto text-pretty break-all font-medium text-muted">
        {item.comment}
      </p>
    </div>
  );
}
