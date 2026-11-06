import { View } from 'react-native'

import { cn } from '@/lib/utils'

export type DayDotState = 'on' | 'part' | 'none'

interface DayDotsProps {
  /** One entry per day, oldest first. */
  days: readonly DayDotState[]
  className?: string
}

/** The last seven days as dots. Chronological order is kept in both directions. */
export function DayDots({ days, className }: DayDotsProps) {
  return (
    <View accessibilityElementsHidden className={cn('flex-row items-center gap-[5px]', className)}>
      {days.map((state, index) => (
        <View
          key={index}
          className={cn(
            'h-[10px] w-[10px] rounded-full',
            state === 'on' && 'bg-primary',
            state === 'part' && 'border-2 border-primary bg-primary-tint',
            state === 'none' && 'border border-border-strong'
          )}
        />
      ))}
    </View>
  )
}
