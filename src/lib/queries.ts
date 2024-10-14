import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchSingleToken, fetchTokens, fetchTokenStats } from './actions/token';
import { fetchTokenComments } from './actions/comment';
import { getUserById, getUserTokens } from './actions/user';

export function useTokenQuery(id: string) {
  return useQuery({
    queryFn: () => fetchSingleToken(id),
    queryKey: ['token']
  });
}

export function useTokenStatsQuery(id: string) {
  return useQuery({
    queryFn: () => fetchTokenStats(id),
    queryKey: ['tokenStats']
  });
}

export function useCommentsQuery(id: string) {
  return useQuery({
    queryFn: () => fetchTokenComments(id),
    queryKey: ['comments']
  });
}

export function useFetchFavoritesQuery() {
  return useQuery({
    queryFn: () =>
      fetchTokens({
        favorites: true
      }),
    queryKey: ['favorites']
  });
}

export function useUserDetails(userId: string) {
  return useQuery({
    queryFn: () => getUserById(userId),
    queryKey: ['userDetails']
  });
}
export function useUserTokens(userId: string) {
  return useQuery({
    queryFn: () => getUserTokens(userId),
    queryKey: ['userTokens']
  });
}

export function useFetchAllTokensQuery({
  favorites,
  trending,
  search
}: {
  favorites?: boolean;
  trending?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ['tokens', { favorites, trending, search: search }],
    queryFn: () =>
      fetchTokens({
        favorites,
        trending,
        search: search
      })
  });
}
