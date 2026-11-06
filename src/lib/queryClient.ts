import NetInfo from '@react-native-community/netinfo'
import { onlineManager, QueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected ?? true)
  })
})

const MAX_RETRIES = 2

/** Retry transient failures only: 4xx is a contract answer, not a blip. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError) {
    if (error.status === 0) return failureCount < MAX_RETRIES
    if (error.status >= 500) return failureCount < MAX_RETRIES
    return false
  }
  return failureCount < MAX_RETRIES
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
})
