import { useEffect } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'
import { tapImpact } from '@/lib/haptics'
import { useThemeColors } from '@/theme'

const EASE = Easing.bezier(0.23, 1, 0.32, 1)

interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  accessibilityLabel: string
  disabled?: boolean
  className?: string
}

/** 52 by 32 pill with a 26px knob that slides to the other end. */
export function Switch({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  className,
}: SwitchProps) {
  const colors = useThemeColors()
  const reduced = useReducedMotion()
  const progress = useSharedValue(value ? 1 : 0)

  useEffect(() => {
    progress.set(
      withTiming(value ? 1 : 0, { duration: reduced ? 0 : 180, easing: EASE })
    )
  }, [progress, reduced, value])

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [colors['surface-3'], colors.success]),
  }))
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * 20 }],
  }))

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={() => {
        tapImpact()
        onValueChange(!value)
      }}
      hitSlop={8}
      className={cn(disabled && 'opacity-50', className)}
    >
      <Animated.View
        style={track}
        className="h-8 w-[52px] justify-center rounded-full"
      >
        <Animated.View
          style={knob}
          className="ml-[3px] h-[26px] w-[26px] rounded-full bg-surface shadow-l1"
        />
      </Animated.View>
    </Pressable>
  )
}
