import { useEffect } from 'react'
import { View } from 'react-native'
import { Txt as Text } from './Txt'
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

export type BarTone = 'p' | 'c' | 'f' | 'w'

const fillTone: Record<BarTone, string> = {
  p: 'bg-protein',
  c: 'bg-carbs',
  f: 'bg-fat',
  w: 'bg-water',
}

const AnimatedView = Animated.createAnimatedComponent(View)

/** Clamped 0 to 100. Values above the goal still fill the whole track. */
function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

interface MacroBarProps {
  label: string
  /** Current amount. */
  value: number | null
  /** Target amount, the full width of the track. */
  goal: number | null
  tone?: BarTone
  /** Rendered at the end of the label line, e.g. `76 / 128 g`. */
  format?: (value: number, goal: number) => string
  className?: string
}

/**
 * 8px track, radius full. The fill colour alone carries the macro, so the label
 * stays neutral and no swatch is needed.
 */
export function MacroBar({
  label,
  value,
  goal,
  tone = 'p',
  format,
  className,
}: MacroBarProps) {
  const [t] = useTranslation()
  const reduced = useReducedMotion()
  const percent = value !== null && goal !== null && goal > 0 ? clamp((value / goal) * 100) : 0
  const width = useSharedValue(reduced ? percent : 0)

  useEffect(() => {
    width.set(reduced ? percent : withTiming(percent, { duration: 420 }))
  }, [percent, reduced, width])

  const bar = useAnimatedStyle(() => ({ width: `${width.get()}%` }))

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={
        value !== null && goal !== null
          ? { min: 0, max: goal, now: Math.min(value, goal) }
          : undefined
      }
      className={cn('gap-[6px]', className)}
    >
      <View className="flex-row items-center gap-s2">
        <Text className="text-sm font-rubik-semibold text-text">{label}</Text>
        <Text className="ml-auto text-sm font-rubik-medium text-text-2" numeric>
          {value === null || goal === null
            ? t('common.noData')
            : format
              ? format(value, goal)
              : t('macroBar.defaultFormat', { value, goal })}
        </Text>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-track">
        <AnimatedView className={cn('h-2 rounded-full', fillTone[tone])} style={bar} />
      </View>
    </View>
  )
}

interface UsageMeterProps {
  label: string
  value: number
  goal: number
  tone?: 'normal' | 'warn' | 'over'
  format?: (value: number, goal: number) => string
  className?: string
}

const usageFill: Record<NonNullable<UsageMeterProps['tone']>, string> = {
  normal: 'bg-primary',
  warn: 'bg-warning',
  over: 'bg-error',
}

/** Product data, so a filled track is correct here. */
export function UsageMeter({
  label,
  value,
  goal,
  tone = 'normal',
  format,
  className,
}: UsageMeterProps) {
  const [t] = useTranslation()
  const percent = goal > 0 ? clamp((value / goal) * 100) : 0
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: goal, now: Math.min(value, goal) }}
      className={cn('gap-[6px]', className)}
    >
      <View className="flex-row justify-between gap-s2">
        <Text className="text-xs font-rubik-semibold text-text">{label}</Text>
        <Text className="text-xs font-rubik-medium text-text-2" numeric>
          {format ? format(value, goal) : t('usageMeter.defaultFormat', { value, goal })}
        </Text>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-surface-3">
        <View className={cn('h-2 rounded-full', usageFill[tone])} style={{ width: `${percent}%` }} />
      </View>
    </View>
  )
}

/** Generic alias for general-use progress bars. */
export const ProgressBar = MacroBar
