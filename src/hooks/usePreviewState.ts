import { useCallback } from 'react'
import { useLocalSearchParams } from 'expo-router'

import { usePreviewStore, type PreviewState } from '@/store/dev/previewStore'

export type { PreviewState }

const PREVIEW_STATES: readonly PreviewState[] = ['loading', 'empty', 'error']

export function usePreviewState(): PreviewState {
  const { state } = useLocalSearchParams<{ state?: string }>()
  const previewState = usePreviewStore((store) => store.state)

  if (!__DEV__) return 'ready'
  if (state && PREVIEW_STATES.includes(state as PreviewState)) return state as PreviewState
  return previewState
}

/**
 * The action behind an error state's retry.
 *
 * A screen that reads from the API will pass the query's `refetch` here. Until
 * then this puts the screen back into its normal state, which is exactly what
 * a retry means when the data is already on the device.
 */
export function useRetry() {
  return useCallback(() => {
    if (!__DEV__) return
    usePreviewStore.getState().setState('ready')
  }, [])
}
