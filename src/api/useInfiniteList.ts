import { useInfiniteQuery } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

/**
 * Generic infinite-scroll query for paginated endpoints (catalogs, feeds,
 * search results). Pairs with FlatList: rows come from
 * `data.pages.flatMap((p) => p.results)`, more loads via `fetchNextPage()`
 * in `onEndReached` guarded by `hasNextPage`.
 */
export function useInfiniteList<T>(
  queryKey: (string | Record<string, unknown>)[],
  fetcher: (page: number) => Promise<PaginatedResponse<T>>
) {
  return useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetcher(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  })
}
