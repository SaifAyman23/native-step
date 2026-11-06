import { useEffect, useState, type Ref } from 'react'
import { TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native'
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

import { Txt as Text } from './Txt'

const EASE = Easing.bezier(0.23, 1, 0.32, 1)

interface TextAreaProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  /** Muted line under the field, e.g. `One way. They cannot reply here.` */
  hint?: string
  /** Shows the character counter when set. */
  maxLength?: number
  error?: string
  disabled?: boolean
  autoCapitalize?: TextInputProps['autoCapitalize']
  autoCorrect?: boolean
  inputRef?: Ref<TextInputInstance>
  className?: string
}

/**
 * Multi-line sibling of `Input`. The wrapper owns the surface, border, radius
 * and focus halo so the field reads as the same control at a taller height.
 */
export function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  maxLength,
  error,
  disabled = false,
  autoCapitalize = 'sentences',
  autoCorrect,
  inputRef,
  className,
}: TextAreaProps) {
  const [focused, setFocused] = useState(false)
  const colors = useThemeColors()
  const reduced = useReducedMotion()
  const focus = useSharedValue(0)

  useEffect(() => {
    if (disabled) {
      focus.set(0)
      return
    }
    const hasError = !!error
    const target = hasError ? 1 : focused ? 0.5 : 0
    focus.set(reduced ? target : withTiming(target, { duration: 160, easing: EASE }))
  }, [disabled, error, focus, focused, reduced])

  const frameStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.get(),
      [0, 0.5, 1],
      [colors['border-strong'], colors.primary, colors.error]
    ),
  }))

  /**
   * The focus halo animates, so it keeps the per-property shadow props. A
   * `boxShadow` string cannot be interpolated by a worklet: the whole string
   * would be rebuilt every frame instead of the colour and radius blending.
   */
  const haloStyle = useAnimatedStyle(() => ({
    shadowColor: interpolateColor(
      focus.get(),
      [0, 0.5, 1],
      [colors['surface-2'], colors.primary, colors.error]
    ),
    shadowOpacity: focus.get() * 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  }))

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.get(),
      [0, 1],
      [disabled ? colors['surface-3'] : colors.surface, colors.surface]
    ),
  }))

  const showCounter = maxLength != null

  return (
    <View className={cn('w-full gap-s2', className)}>
      {label ? <Text className="mb-3 text-label text-text">{label}</Text> : null}

      <Animated.View
        style={[frameStyle, haloStyle, surfaceStyle]}
        className="min-h-[148px] w-full rounded-lg border-2 px-s5 py-s4"
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors['text-3']}
          maxLength={maxLength}
          editable={!disabled}
          multiline
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          underlineColorAndroid="transparent"
          className={cn(
            'min-h-[120px] w-full bg-transparent p-0 text-base leading-[24px]',
            disabled ? 'text-text-3' : 'text-text'
          )}
          style={{
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            textAlignVertical: 'top',
            includeFontPadding: false,
          }}
        />
      </Animated.View>

      {error ? <Text className="text-caption text-error-text">{error}</Text> : null}

      {hint || showCounter ? (
        <View className="flex-row justify-between gap-s3">
          {hint ? <Text className="flex-1 text-caption text-text-3">{hint}</Text> : <View />}
          {showCounter ? (
            <Text className="text-caption text-text-3" numeric>
              {`${value.length} / ${maxLength}`}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}
