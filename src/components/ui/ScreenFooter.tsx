import type { ReactNode } from 'react'
import { View, type ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/lib/utils'

/** Pinned action bar at the bottom of a screen, above the safe area. */
export function ScreenFooter({
  children,
  className,
  pointerEvents,
}: {
  children: ReactNode
  className?: string
  pointerEvents?: ViewProps['pointerEvents']
}) {
  const insets = useSafeAreaInsets()
  return (
    <View
      pointerEvents={pointerEvents}
      className={cn(
        'flex-none rounded-t-2xl bg-surface px-s6 pt-s6',
        className
      )}
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      {children}
    </View>
  )
}
