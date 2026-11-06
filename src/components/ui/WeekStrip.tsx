import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

export interface WeekDay {
  /** Short day name, e.g. `Sat`. */
  label: string
  /** Day of the month. */
  date: number
  /** Percent of target reached. `null` only for an upcoming period. */
  percent?: number | null
  isToday?: boolean
  isFuture?: boolean
}

interface WeekStripProps {
  days: readonly WeekDay[]
  onSelect?: (index: number) => void
  selectedIndex?: number
  className?: string
}

/**
 * Seven equal columns, always Saturday to Friday. Today is always inside the
 * range and the strip never shifts to start on Monday.
 */
export function WeekStrip({ days, onSelect, selectedIndex, className }: WeekStripProps) {
  return (
    <View className={cn('flex-row gap-s1', className)}>
      {days.map((day, index) => {
        const dim = day.isFuture
        const body = (
          <>
            <Text
              className={cn(
                'text-xs font-rubik-semibold',
                day.isToday ? 'text-primary-text' : dim ? 'text-text-3' : 'text-text-2'
              )}
            >
              {day.label}
            </Text>
            <Text
              className={cn(
                'h-8 w-8 items-center justify-center rounded-full text-sm font-rubik-bold',
                day.isToday
                  ? 'bg-primary-tint text-primary-text'
                  : index === selectedIndex
                    ? 'bg-surface-3 text-text'
                    : 'text-text'
              )}
              style={{ textAlign: 'center', lineHeight: 28 }}
            >
              {day.date}
            </Text>
            <View className="h-1 w-5 overflow-hidden rounded-full bg-track">
              {day.percent != null && !dim ? (
                <View
                  className="h-1 rounded-full bg-primary"
                  style={{ width: `${Math.max(0, Math.min(100, day.percent))}%` }}
                />
              ) : null}
            </View>
          </>
        )
        const shell = cn(
          'min-h-[44px] flex-1 items-center gap-[3px] rounded-md pb-s3 pt-s2',
          index === selectedIndex && 'bg-surface-2'
        )

        if (dim || !onSelect) {
          return (
            <View key={`${day.label}-${day.date}`} className={shell}>
              {body}
            </View>
          )
        }
        return (
          <Pressable
            key={`${day.label}-${day.date}`}
            accessibilityRole="button"
            accessibilityLabel={`${day.label} ${day.date}`}
            accessibilityState={{ selected: index === selectedIndex }}
            onPress={() => onSelect(index)}
            className={shell}
            style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
          >
            {body}
          </Pressable>
        )
      })}
    </View>
  )
}
