import type { ReactNode } from 'react'
import { View } from 'react-native'

import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <View
      className={cn('w-full rounded-xl border border-border bg-surface p-s6', className)}
    >
      {children}
    </View>
  )
}
