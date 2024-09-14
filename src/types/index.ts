export enum STATE_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export type Token = {
  unique_id: string;
  id: number;
  description: string;
  total_supply: string;
  contract_address: string;
  creator_id: string;
  name: string;
  symbol: string;
  logo_url: string;
  social_links: string;
  creator: {
    unique_id: string;
    username: string | null;
    wallet_address: string;
  };
  created_at: string;
  updated_at: string;
};

export type User = {
  unique_id: string;
  username: string | null;
  wallet_address: string;
  profile_image: string | null;
};

export type CommentType = {
  unique_id: string;
  id: number;
  message: string;
  user_id: string;
  token_id: string;
  created_at: string;
  updated_at: string;
  user: User;
};

export type UserType = {
  unique_id: string;
  id: number;
  wallet_address: string;
  profile_image: string | null;
  username: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type TokenLike = {
  unique_id: string;
  id: number;
  user_id: string;
  token_id: string;
  created_at: string;
  updated_at: string;
  user: {
    unique_id: string;
    username: string;
    profile_image: string;
    wallet_address: string;
  };
  token: {
    unique_id: string;
    name: string;
    symbol: string;
    logo_url: string;
    creator_id: string;
  };
};
