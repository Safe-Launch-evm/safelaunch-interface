'use client';

import { ChangeEvent, DragEvent, ReactNode, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatBytes, truncate } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from './ui/button';
import { MimeTypes } from '@/types';
import { CameraIcon, CloudArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cva, VariantProps } from 'class-variance-authority';

const FILE_TYPE_NAMES = {
  'image/png': 'PNG',
  'image/jpg': 'JPG',
  'image/jpeg': 'JPEG',
  'image/svg': 'SVG',
  'image/gif': 'GIF'
};

interface ISection {
  [key: string]: ReactNode;
}

const fileVariants = cva('flex w-full flex-col items-center justify-center', {
  variants: {
    variant: {
      default: 'gap-3 rounded-lg border border-dashed border-primary p-6',
      profile:
        'group size-[124px] cursor-pointer rounded-full border border-dashed border-foreground bg-foreground/[0.08] hover:bg-transparent'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

interface FileInputProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fileVariants> {
  label?: string;
  types?: MimeTypes[];
  isMultiple?: boolean;
  maxFileSize?: number;
  disabled?: boolean;
  handleFileChange: (files: File) => void;
}

const FileInput = ({
  types = [MimeTypes.PNG, MimeTypes.JPEG, MimeTypes.SVG, MimeTypes.JPG, MimeTypes.GIF],
  maxFileSize = 5,
  label = 'Upload logo',
  handleFileChange,
  variant,
  className,
  disabled
}: FileInputProps) => {
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleButtonClick = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };

  const handleDocumentDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const fileEvent = { target: { files: event.dataTransfer.files } };
      onImageChange(fileEvent);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files.length > 4) {
        toast.error(`File size should be less than ${maxFileSize}MB`);
        return;
      }
      const { acceptable, unacceptable } = validateFiles(
        Array.from(event.target.files),
        maxFileSize
      );

      if (unacceptable.length > 0) {
        toast.error(`File size should be less than ${maxFileSize}MB`);
      } else {
        setFile(acceptable[0]);

        handleFileChange(acceptable[0]);
      }
    }
  };

  const TokenUpload = () => {
    if (file) {
      return (
        <div className="flex w-full items-start justify-between gap-3 rounded-lg border border-primary p-6">
          <div className="flex items-center gap-2">
            <div className="relative size-16 rounded">
              <div className="group absolute inset-0 flex items-center justify-center">
                <Image
                  src={URL.createObjectURL(file) as string}
                  fill={true}
                  alt="uploaded image"
                  objectFit="cover"
                  className="cursor-pointer rounded-lg transition group-hover:brightness-50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap">{truncate(file.name, 28)}</span>
              <span>{formatBytes(file.size)}</span>
            </div>
          </div>
          <Button type="button" variant={'ghost'} size={'icon'} onClick={() => setFile(null)}>
            <TrashIcon className="size-4" />
          </Button>
        </div>
      );
    }
    return (
      <div
        className={cn(fileVariants({ variant }), className)}
        onDrop={handleDocumentDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
      >
        <motion.div animate={{ scale: isDragOver ? 1.5 : 1 }}>
          <CloudArrowDownIcon className="size-10 text-primary" />
        </motion.div>
        <div
          className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 transition-all duration-200"
          onClick={handleButtonClick}
        >
          <span>
            Drag your file(s) or{' '}
            <span className="text-primary group-hover:text-accent-200">browse</span>
          </span>
          <p className="text-foreground/[0.50]">
            {' '}
            {types
              .map(type => FILE_TYPE_NAMES[type])
              .join(', ')
              .replace(/,([^,]*)$/, ' or$1')}{' '}
            formats up to {maxFileSize}MB
          </p>
        </div>
        <input
          ref={documentInputRef}
          id="file-input"
          type="file"
          accept={types.join(',')}
          className="hidden"
          onChange={onImageChange}
          disabled={disabled}
        />
      </div>
    );
  };

  const ProfileUpload = () => {
    if (file) {
      return (
        <div className="group relative flex size-[124px] flex-col items-center justify-center rounded-full border border-foreground bg-foreground/[0.08] p-[62px]">
          <div className="group absolute inset-0 flex items-center justify-center">
            <Image
              src={URL.createObjectURL(file) as string}
              fill={true}
              alt="uploaded image"
              objectFit="cover"
              className="cursor-pointer rounded-full transition group-hover:brightness-50"
            />
            <div
              role="button"
              className="absolute opacity-0 shadow-none group-hover:opacity-100"
              onClick={() => setFile(null)}
            >
              <TrashIcon className="size-6" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={cn(fileVariants({ variant }), className)}
        onDrop={handleDocumentDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        onClick={handleButtonClick}
      >
        <CameraIcon className="size-6 group-hover:text-primary" />
        <input
          ref={documentInputRef}
          id="file-input"
          type="file"
          accept={types.join(',')}
          className="hidden"
          onChange={onImageChange}
          disabled={disabled}
        />
      </div>
    );
  };

  const sections: ISection = {
    default: <TokenUpload />,
    profile: <ProfileUpload />
  };

  return (
    <div
      className={cn('flex w-full flex-col gap-2', {
        'flex-col-reverse items-center justify-center': variant === 'profile'
      })}
    >
      <span>{label}</span>

      {sections[variant ?? 'default']}
    </div>
  );
};

export default FileInput;

const validateFiles = (files: File[], maxFileSize: number) => {
  let acceptable: File[] = [];
  let unacceptable: { file: File; reason: string }[] = [];
  files.forEach(file => {
    if (file.size > maxFileSize * 1024 * 1024) {
      unacceptable.push({ file, reason: 'File is too big' });
      return;
    }
    acceptable.push(file);
  });
  return {
    acceptable,
    unacceptable
  };
};
