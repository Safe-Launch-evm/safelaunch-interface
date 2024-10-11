import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchSingleToken, fetchTokens, fetchTokenStats } from './actions/token';
import { fetchTokenComments } from './actions/comment';

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
