'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

type TImageComponent = {
  width?: number;
  height?: number;
  src: string;
  alt?: string;
  style?: object;
  className?: string;
  fill?: boolean;
};

export default function ImageComponent({
  width,
  height,
  src = '',
  alt = '',
  className = '',
  fill = false
}: TImageComponent): React.ReactNode {
  const [loading, setLoading] = useState(true);

  const onImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div
          className={cn(
            'flex animate-pulse items-center justify-center bg-foreground/[0.20] text-primary/50',
            className
          )}
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height
          }}
        >
          <ImageIcon size={80} />
        </div>
      )}
      <Image
        onLoad={onImageLoad}
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={cn('object-cover', className)}
        fill={fill}
        style={{ opacity: loading ? 0 : 100 }}
      />
    </>
  );
}
