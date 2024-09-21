import { z } from 'zod';

const socialLinksSchema = z.object({
  website: z.string().optional(),
  twitter: z.string().optional(),
  discord: z.string().optional(),
  telegram: z.string().optional()
});

export const createTokenSchema = z.object({
  name: z.string().min(1, { message: 'Provide a name for token' }),
  symbol: z.string().min(1, { message: 'Provide a symbol for token' }).max(4, { message: 'Symbol can\'t be more than 4 characters' }),
  liquidityAmount: z.string().optional(),
  totalSupply: z.string().optional(),
  image: z.any(),
  // image: z.any(
  //   z.instanceof(File).refine(file => file.size < 5 * 1024 * 1024, {
  //     message: 'File size must be less than 5MB'
  //   })
  // ),
  logoUrl: z.string(),
  contractAddress: z.string(),
  description: z.string(),
  socialLinks: socialLinksSchema
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;
