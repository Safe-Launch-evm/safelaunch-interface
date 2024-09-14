'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

const schema = z.object({
  auth_token: z.string().optional(),
  accountKey: z.string().optional(),
  expires_at: z.string().optional()
});

type KeyValueMap = z.infer<typeof schema>;

type Key = keyof KeyValueMap;
type Value<K extends Key> = KeyValueMap[K];

export async function setCookieStorage<K extends Key>(
  key: K,
  value: Exclude<Value<K>, undefined>
) {
  let val: string;

  if (typeof value !== 'string') val = JSON.stringify(value);
  val = value;
  cookies().set(key, val, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

export async function getCookieStorage<K extends Key>(key: K): Promise<Value<K>> {
  const cookieValue = cookies().get(key);
  return cookieValue?.value as Value<K>;
}
export async function deleteCookieItem<K extends Key>(key: K) {
  return await cookies().delete(key);
}
