import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

export type WeekBarState = 'on' | 'part' | 'over' | 'none'

export interface WeekBar {
  label: string
  state: WeekBarState
  /** Share of the day target, 0 to 100. Ignored when `state` is `none`. */
  percent?: number
  isToday?: boolean
}

const barTone: Record<WeekBarState, string> = {
  on: 'bg-primary',
  part: 'border-[2px] border-primary bg-primary-tint',
  over: 'bg-warning',
  none: 'bg-track',
}

interface WeekBarsProps {
  days: readonly WeekBar[]
  /** Dashed target line as a percentage of the chart height. */
  targetPercent?: number
  targetLabel?: string
  /** One honest line under the chart. */
  footnote?: string
  height?: number
  className?: string
}

/**
 * Seven bars, one per day, each as a share of the day target. A day with nothing
 * logged is a short stub, never a blank column.
 */
export function WeekBars({
  days,
  targetPercent,
  targetLabel = 'Target',
  footnote,
  height = 108,
  className,
}: WeekBarsProps) {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`Progress as a share of target over the last ${days.length} days`}
      className={cn('gap-s2', className)}
    >
      <View className="relative" style={{ height }}>
        {targetPercent != null ? (
          <View
            pointerEvents="none"
            className="absolute inset-x-0"
            style={{ bottom: `${targetPercent}%` }}
          >
            <View className="border-t-[1.5px] border-dashed border-border-strong" />
            <Text className="absolute -top-[17px] right-0 text-xs font-rubik-semibold text-text-3">
              {targetLabel}
            </Text>
          </View>
        ) : null}

        <View className="h-full flex-row items-end gap-s2 px-[2px]">
          {days.map((day) => (
            <View key={day.label} className="h-full flex-1 items-center justify-end">
              <View
                className={cn(
                  'w-full max-w-[30px] rounded-t-sm rounded-b-[4px]',
                  barTone[day.state]
                )}
                style={{
                  height: day.state === 'none' ? 6 : `${Math.max(0, Math.min(100, day.percent ?? 0))}%`,
                }}
              />
            </View>
          ))}
        </View>
      </View>

      <View className="flex-row gap-s2 px-[2px]">
        {days.map((day) => (
          <Text
            key={day.label}
            className={cn(
              'flex-1 text-center text-xs font-rubik-semibold',
              day.isToday ? 'text-primary-text' : 'text-text-2'
            )}
          >
            {day.label}
          </Text>
        ))}
      </View>

      {footnote ? <Text className="text-sm mt-2 text-text-2">{footnote}</Text> : null}
    </View>
  )
}
