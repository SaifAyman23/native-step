import { View } from 'react-native'

import { cn } from '@/lib/utils'

export type MeterTone = 'normal' | 'warn' | 'over'

const fillTone: Record<MeterTone, string> = {
  normal: 'bg-primary',
  warn: 'bg-warning',
  over: 'bg-error',
}

interface MeterProps {
  /** 0 to 100. Values above the goal still fill the whole track. */
  percent: number
  tone?: MeterTone
  accessibilityLabel?: string
  className?: string
}

/** A bare 6px progress track with no label. A labelled meter is `UsageMeter`. */
export function Meter({ percent, tone = 'normal', accessibilityLabel, className }: MeterProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      className={cn('h-[6px] overflow-hidden rounded-full bg-track', className)}
    >
      <View className={cn('h-[6px] rounded-full', fillTone[tone])} style={{ width: `${clamped}%` }} />
    </View>
  )
}
