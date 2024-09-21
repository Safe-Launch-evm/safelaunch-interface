import { Token, TokenLike, UserType } from '@/types';
import client from '../client';
import { setCookieStorage } from '../cookie-storage';
import { Request } from '../http';
import { ProfileInput } from '../validations/profile-schema';
import { unstable_noStore as noStore } from 'next/cache';

export type UserResponse = {
  error: boolean;
  data: string;
  code: number;
  result: UserType[];
};

export async function getUser({ address }: { address: string }): Promise<UserType | null> {
  noStore();
  try {
    const user: UserResponse = await client(`/user/auth/${address}`, { tag: 'user' });
    if (user.code !== 200) {
      return null;
    }
    return user.result[0];
  } catch (error) {
    return null;
  }
}
export async function getUserById(userId: string ): Promise<UserType | null> {
  try {
    const user: UserResponse = await client(`/user/${userId}`, { tag: 'user' });
    if (user.code !== 200) {
      return null;
    }
    return user.result[0];
  } catch (error) {
    return null;
  }
}

export async function registerUser(data: ProfileInput) {
  noStore();
  try {
    const user = await client(`/user/register`, { tag: 'user', formData: data });
    if (!user) return user;
    return user;
  } catch (error) {
    return null;
  }
}

export async function getNonce({ address }: { address: string }) {
  noStore();
  try {
    const nonce = await client('/auth/get-nonce', {
      formData: { walletAddress: address },
      tag: 'nonce'
    });
    return nonce;
  } catch (error) {
    return null;
  }
}

export async function verifyNonce({ address, sig }: { address: string; sig: string }) {
  noStore();
  try {
    const nonce: any = await client('/auth/verify-nonce', {
      formData: { walletAddress: address, signature: sig },
      tag: 'nonce'
    });
    if (nonce.code !== 200) {
      return null;
    }
    await setCookieStorage('auth_token', nonce.result.token);
    await setCookieStorage('expires_at', nonce.result.expires_at);
    return nonce;
  } catch (error) {
    return null;
  }
}

type FetchTokenResponse = {
  error: boolean;
  data: string;
  code: number;
  result: Token[] | TokenLike[];
};

type ResultPromise = {
  favorites: TokenLike[];
  tokens: Token[];
};
export async function getUserTokens(userId: string): Promise<ResultPromise> {
  noStore();
  try {
    const tokens: FetchTokenResponse = await client(`/tokens/user/${userId}`, {
      tag: 'user_token'
    });
    const favorites: FetchTokenResponse = await client(`/token/favorite/${userId}`, {
      tag: 'favorite'
    });

    return {
      favorites: favorites ? (favorites.result as TokenLike[]) : [],
      tokens: tokens ? (tokens.result as Token[]) : []
    };
  } catch (error) {
    return { favorites: [], tokens: [] };
  }
}
