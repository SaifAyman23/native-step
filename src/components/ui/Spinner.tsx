import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'
import { useThemeColors, type ColorToken } from '@/theme'

interface SpinnerProps {
  /** Diameter in pixels. */
  size?: number
  /** The colour of the moving arc. The track uses the border token. */
  color?: ColorToken
  className?: string
}

/**
 * The one spinner in the app. A ring that turns, themed like everything else.
 *
 * It is a component of its own rather than an inline indicator in the button:
 * a primitive that appears in more than one place belongs in `components/ui`,
 * and the gallery is where it gets shown.
 */
export function Spinner({ size = 18, color = 'on-primary', className }: SpinnerProps) {
  const colors = useThemeColors()
  const reduced = useReducedMotion()
  const spin = useSharedValue(0)

  useEffect(() => {
    if (reduced) return
    spin.set(
      withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false)
    )
  }, [reduced, spin])

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.get()}deg` }],
  }))

  const thickness = Math.max(2, Math.round(size / 8))

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[{ width: size, height: size }, style]}
      className={cn('items-center justify-center', className)}
    >
      <View
        className="h-full w-full rounded-full"
        style={{
          borderWidth: thickness,
          borderColor: colors['border-strong'],
          borderTopColor: colors[color],
        }}
      />
    </Animated.View>
  )
}
