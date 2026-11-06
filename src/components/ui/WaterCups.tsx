import { useThemeColors } from '@/theme'
import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'

import { Card } from './Card'
import { Txt as Text } from './Txt'

const EASE = Easing.bezier(0.23, 1, 0.32, 1)

interface WaterCupsProps {
  /** How many cups are filled. */
  filled: number
  total?: number
  /** Tapping a cup sets the count to that index. */
  onChange?: (next: number) => void
  className?: string
}

interface WaterCardProps extends WaterCupsProps {
  label?: string
  /** Right-hand caption, e.g. `1,250 of 2,000 ml`. */
  caption: string
}

/**
 * Count meter as a card: label and caption on one line, the cups below. The caption is
 * the only place the real volume appears, so the cups stay a quick glance.
 */
export function WaterCard({
  label = 'Progress',
  caption,
  filled,
  total = 8,
  onChange,
  className,
}: WaterCardProps) {
  return (
    <Card className={className}>
      <View className="flex-row items-baseline justify-between gap-s3">
        <Text className="text-title font-rubik-bold text-text">{label}</Text>
        <Text className="text-caption text-text-2">{caption}</Text>
      </View>
      <View className="mt-s4">
        <WaterCups filled={filled} total={total} onChange={onChange} />
      </View>
    </Card>
  )
}

/**
 * Eight cups, 250ml each. Tap an empty cup to add, tap a filled one to undo back
 * to it.
 *
 * The fill sits under the ring rather than inside the border: an absolutely
 * positioned child is laid out against the parent's padding box, so a fill sized
 * to the parent height paints straight over a 2px border. Painting the ring last,
 * on top of a clipped fill, is what keeps the water inside its lines.
 */
export function WaterCups({ filled, total = 8, onChange, className }: WaterCupsProps) {
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel="Progress units"
      accessibilityValue={{ min: 0, max: total, now: filled }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') onChange?.(Math.min(total, filled + 1))
        if (event.nativeEvent.actionName === 'decrement') onChange?.(Math.max(0, filled - 1))
      }}
      className={cn('w-full flex-row items-end gap-s2', className)}
    >
      {Array.from({ length: total }, (_, index) => (
        <Cup
          key={index}
          index={index}
          filled={index < filled}
          onPress={onChange ? () => onChange(index + 1) : undefined}
        />
      ))}
    </View>
  )
}

// The design fixes a cup at 32x44, which leaves a fixed row narrower than most
// phones. The cups instead share the width they are given and keep the design's
// proportion from it, capped so they do not stretch into tumblers on a tablet.
const SHELL = 'aspect-[32/44] h-12 max-w-11 w-full justify-end overflow-hidden rounded-t-sm rounded-b-lg'
const RING = 'pointer-events-none absolute inset-0 rounded-t-sm rounded-b-lg border-2'

function Cup({
  index,
  filled,
  onPress,
}: {
  index: number
  filled: boolean
  onPress?: () => void
}) {
  const colors = useThemeColors()
  const reduced = useReducedMotion()
  const level = useSharedValue(0)

  useEffect(() => {
    level.set(
      reduced ? (filled ? 1 : 0) : withTiming(filled ? 1 : 0, { duration: 380, easing: EASE })
    )
  }, [filled, level, reduced])

  const fill = useAnimatedStyle(() => ({
    height: `${interpolate(level.get(), [0, 1], [0, 100])}%`,
    backgroundColor: interpolateColor(level.get(), [0, 1], [colors['surface-2'], colors.water]),
  }))

  const ring = useAnimatedStyle(() => ({
    borderColor: interpolateColor(level.get(), [0, 1], [colors['border-strong'], colors.water]),
  }))

  const body = (
    <View className={cn(SHELL, 'bg-surface')}>
      <Animated.View style={fill} className="absolute inset-x-0 bottom-0" />
      <Animated.View style={ring} className={RING} />
    </View>
  )

  if (!onPress) return <View className="flex-1">{body}</View>

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Cup ${index + 1}, ${filled ? 'full' : 'empty'}`}
      onPress={onPress}
      pressRetentionOffset={12}
      className="flex-1 self-end"
      style={({ pressed }) => (pressed ? { transform: [{ translateY: 2 }] } : undefined)}
    >
      {body}
    </Pressable>
  )
}

/** Generic aliases. Count-based progress, not water-specific. */
export const CupMeter = WaterCups
export const CountMeter = WaterCups
export const CupCard = WaterCard
