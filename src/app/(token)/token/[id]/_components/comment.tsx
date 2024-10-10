'use client';
import { CornerUpLeft, Heart } from 'lucide-react';
import Image from 'next/image';

type CommentProps = {
  username: string;
  date: string;
  avatar: string;
  comment: string;
};

export default function Comment({ ...item }: CommentProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch rounded border border-card-foreground bg-card p-2 lg:p-4">
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

          <span className="flex items-center justify-center rounded bg-accent px-2 py-[2px]">
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
