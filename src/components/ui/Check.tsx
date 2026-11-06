import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'
import { useThemeColors } from '@/theme'

import { useQootIcon } from './Icon'
import { CheckIcon } from './icons'

const EASE = Easing.bezier(0.23, 1, 0.32, 1)

interface CheckProps {
  checked: boolean
  onChange: (checked: boolean) => void
  accessibilityLabel: string
  disabled?: boolean
  className?: string
  size?: 26 | 22
  tone?: 'square' | 'round'
}

type Tone = NonNullable<CheckProps['tone']>

const toneClass: Record<Tone, string> = {
  square: 'rounded-sm',
  round: 'rounded-full',
}

/** Inner dot, small enough that the primary ring still reads as a ring. */
const DOT = { 26: 10, 22: 8 } as const

/** Border, fill and dot colours per tone, resolved once per theme. */
function useCheckColors(tone: Tone) {
  const colors = useThemeColors()
  if (tone === 'round') {
    return {
      borderOn: colors.primary,
      borderOff: colors['border-strong'],
      fillOn: colors.surface,
      fillOff: colors.surface,
      dot: colors.primary,
    }
  }
  return {
    borderOn: colors.primary,
    borderOff: colors['border-strong'],
    fillOn: colors.primary,
    fillOff: colors.surface,
    dot: colors['on-primary'],
  }
}

/**
 * The animated body of a checkbox or radio: border colour, fill and dot all ease
 * together, so a selection is never an instant colour swap.
 */
function CheckVisual({
  checked,
  size,
  tone,
  className,
}: {
  checked: boolean
  size: 26 | 22
  tone: Tone
  className?: string
}) {
  const colors = useThemeColors()
  const reduced = useReducedMotion()
  const spec = useCheckColors(tone)
  const progress = useSharedValue(checked ? 1 : 0)

  useEffect(() => {
    progress.set(reduced ? (checked ? 1 : 0) : withTiming(checked ? 1 : 0, { duration: 180, easing: EASE }))
  }, [checked, progress, reduced])

  const box = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.get(), [0, 1], [spec.borderOff, spec.borderOn]),
    backgroundColor: interpolateColor(progress.get(), [0, 1], [spec.fillOff, spec.fillOn]),
  }))

  const mark = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ scale: 0.7 + progress.get() * 0.3 }],
  }))

  const glyph = useQootIcon(tone === 'round' ? 'primary' : 'on-primary', size === 26 ? 16 : 14, 'bold')

  return (
    <Animated.View
      className={cn(
        'items-center justify-center border-2',
        size === 26 ? 'h-[26px] w-[26px]' : 'h-[22px] w-[22px]',
        toneClass[tone],
        className
      )}
      style={box}
    >
      <Animated.View style={mark} className="items-center justify-center">
        {tone === 'round' ? (
          <View
            style={{ width: DOT[size], height: DOT[size], backgroundColor: colors.primary }}
            className="rounded-full"
          />
        ) : (
          <CheckIcon {...glyph} />
        )}
      </Animated.View>
    </Animated.View>
  )
}

/** Non-interactive radio or checkbox, for rows that own the press. */
export function CheckMark({
  checked,
  size = 26,
  tone = 'square',
  className,
}: {
  checked: boolean
  size?: 26 | 22
  tone?: Tone
  className?: string
}) {
  return <CheckVisual checked={checked} size={size} tone={tone} className={className} />
}

/** Checkbox and radio share one control; only the shape and the mark differ. */
export function Check({
  checked,
  onChange,
  accessibilityLabel,
  disabled = false,
  className,
  size = 26,
  tone = 'square',
}: CheckProps) {
  return (
    <Pressable
      accessibilityRole={tone === 'square' ? 'checkbox' : 'radio'}
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      hitSlop={8}
      pressRetentionOffset={12}
      className={cn(disabled && 'opacity-50', className)}
    >
      <CheckVisual checked={checked} size={size} tone={tone} />
    </Pressable>
  )
}
