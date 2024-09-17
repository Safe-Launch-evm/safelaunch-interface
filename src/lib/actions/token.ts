import { Token, TokenLike } from '@/types';
import client from '../client';
import { getCookieStorage } from '../cookie-storage';
import { CreateTokenInput } from '../validations/create-token-schema';

export async function uploadLogo(data: FormData) {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: data
    });
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function createToken(data: CreateTokenInput) {
  try {
    const token = await getCookieStorage('auth_token');

    const result: any = await client('/tokens', {
      formData: data,
      token,
      tag: 'nonce'
    });

    if (result.error === true) {
      return null;
    }

    return result;
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

// export async function fetchTokens({
//   trending = false,
//   favorites = false,
//   search
// }: {
//   search?: string;
//   trending?: boolean;
//   favorites?: boolean;
// } = {}): Promise<Token[] | TokenLike[] | null> {
//   try {
//     const token = await getCookieStorage('auth_token');
//     const queryParams = new URLSearchParams();
//     if (trending) queryParams.append('trending', 'true');
//     if (favorites) queryParams.append('favorites', 'true');

//     const tokens: FetchTokenResponse = await client(`/tokens?${queryParams.toString()}`, {
//       token: token,
//       tag: 'tokens'
//     });

//     if (search) {
//       const tokens: FetchTokenResponse = await client(`/token/search/${search}`, {
//         tag: 'token'
//       });
//       return tokens.result;
//     }
//     if (!tokens.result) {
//       return [];
//     }
//     return tokens.result;
//   } catch (error) {
//     return [];
//   }
// }

type TokenResult = {
  favorites: TokenLike[] | null;
  tokens: Token[] | null;
};

export async function fetchTokens({
  trending = false,
  favorites = false,
  search
}: {
  search?: string;
  trending?: boolean;
  favorites?: boolean;
} = {}): Promise<TokenResult> {
  try {
    const token = await getCookieStorage('auth_token');
    const queryParams = new URLSearchParams();

    if (trending) queryParams.append('trending', 'true');
    if (favorites) queryParams.append('favorites', 'true');

    const endpoint = '/tokens';
    const response: FetchTokenResponse = await client(
      `${endpoint}?${queryParams.toString()}`,
      {
        token,
        tag: 'tokens'
      }
    );

    if (search) {
      const response: FetchTokenResponse = await client(`/token/search/${search}`, {
        tag: 'token'
      });
      return { tokens: response.result as Token[], favorites: null };
    }

    return {
      favorites: favorites ? (response.result as TokenLike[]) : null,
      tokens: !favorites ? (response.result as Token[]) : null
    };
  } catch (error) {
    // console.error('Error fetching tokens:', error);
    return { favorites: null, tokens: null };
  }
}

export async function fetchSingleToken(tokenId: string): Promise<Token | null> {
  try {
    const token: any = await client(`/tokens/${tokenId}`, {
      tag: 'tokens'
    });
    const result = token.result[0];

    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    return null;
  }
}

export async function fetchTokenStats(tokenId: string): Promise<any | null> {
  try {
    const token: any = await client(`/token/stats/${tokenId}`, {
      tag: 'stats'
    });
    const result = token.result;

    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    return null;
  }
}

export async function favoriteToken(tokenId: string) {
  try {
    const token = await getCookieStorage('auth_token');
    const result = await client('/token/favorite', { token, formData: { tokenId } });
    return result;
  } catch (error) {
    return null;
  }
}

export async function deleteFavoriteToken(tokenId: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_APP_CLIENT ?? '';
    const token = await getCookieStorage('auth_token');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/token/favorite/${tokenId}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        }
      }
    );
    return await res.json();
  } catch (error) {
    return null;
  }
}
