import { useEffect, useRef } from 'react'
import { Pressable, TextInput, View, type TextInputInstance } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'
import { useThemeColors } from '@/theme'

const DOT_IDLE = 6
const DOT_ACTIVE = 18
const DOT_HEIGHT = 6
const DOT_GAP = 6

function ProgressDot({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion()
  const colors = useThemeColors()
  const progress = useSharedValue(active ? 1 : 0)

  useEffect(() => {
    progress.set(
      reduceMotion
        ? active
          ? 1
          : 0
        : withTiming(active ? 1 : 0, {
            duration: 180,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })
    )
  }, [active, progress, reduceMotion])

  const dotStyle = useAnimatedStyle(() => ({
    width: DOT_IDLE + (DOT_ACTIVE - DOT_IDLE) * progress.get(),
  }))

  const fillStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
  }))

  return (
    <Animated.View
      style={[
        dotStyle,
        {
          height: DOT_HEIGHT,
          borderRadius: DOT_HEIGHT,
          overflow: 'hidden',
          backgroundColor: colors['border-strong'],
        },
      ]}
    >
      <Animated.View
        style={[
          fillStyle,
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: DOT_HEIGHT,
            backgroundColor: colors.primary,
          },
        ]}
      />
    </Animated.View>
  )
}

interface ProgressDotsProps {
  total: number
  /** How many steps are done, 0 to total. */
  value: number
  className?: string
}

/**
 * Progress is dots only. There is never a step count label, because a generic
 * step label is a banned pattern.
 */
export function ProgressDots({ total, value, className }: ProgressDotsProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: value }}
      className={cn('flex-row items-center', className)}
      style={{ gap: DOT_GAP }}
    >
      {Array.from({ length: total }, (_, index) => (
        <ProgressDot key={index} active={index < value} />
      ))}
    </View>
  )
}

interface CodeBoxProps {
  length?: number
  value: string
  onChangeText: (text: string) => void
  onComplete?: (code: string) => void
  autoFocus?: boolean
  className?: string
}

/** Six boxes, digits only. Filled boxes take the primary tint. */
export function CodeBox({
  length = 6,
  value,
  onChangeText,
  onComplete,
  autoFocus,
  className,
}: CodeBoxProps) {
  const inputRef = useRef<TextInputInstance>(null)

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length)
    onChangeText(digits)
    if (digits.length === length) {
      onComplete?.(digits)
      inputRef.current?.blur()
    }
  }

  return (
    <View className={cn('items-center gap-s4', className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Enter verification code"
        onPress={() => inputRef.current?.focus()}
        className="w-full flex-row justify-center gap-s3"
      >
        {Array.from({ length }, (_, index) => {
          const char = value[index] ?? ''
          return (
            <View
              key={index}
              className={cn(
                'h-14 w-11 items-center justify-center rounded-md border-2 bg-surface',
                char ? 'border-primary bg-primary-tint' : 'border-border-strong'
              )}
            >
              <Text className="text-xl font-rubik-bold text-text" numeric>
                {char}
              </Text>
            </View>
          )
        })}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        maxLength={length}
        textContentType="oneTimeCode"
        accessibilityLabel="Verification code"
        className="h-px w-px opacity-0"
      />
    </View>
  )
}
