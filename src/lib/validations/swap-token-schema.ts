import { z } from 'zod';

export const swapTokenSchema = z.object({
  amount: z.string()
});

export type SwapTokenInput = z.infer<typeof swapTokenSchema>;
