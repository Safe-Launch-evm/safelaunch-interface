import { z } from 'zod';

// const imageSchema =
//   typeof File !== 'undefined'
//     ? z.instanceof(File).refine(file => file.size < 5 * 1024 * 1024, {
//         message: 'File size must be less than 5MB'
//       })
//     : z.any();

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'Username must be at least 3 characters long'
    })
    .max(8, { message: "Username can't be longer than 12 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores'
    })
    .optional()
    .nullish(),
  bio: z.string().optional().nullish(),
  telegram: z.string().optional().nullish(),
  image: z.instanceof(File).optional().nullish(),
  profileImage: z.string().optional().nullish(),
  walletAddress: z.string()
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const commentSchema = z.object({
  message: z.string()
});

export type CommentInput = z.infer<typeof commentSchema>;
