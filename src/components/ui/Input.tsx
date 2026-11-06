import { forwardRef, useEffect, useState, type ReactNode, type Ref } from 'react'
import type { ReturnKeyTypeOptions, TextInputInstance } from 'react-native'
import { TextInput, View } from 'react-native'
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

interface InputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  /** Rendered inside the field at the trailing edge, e.g. `kg`, `ml`, `min`. */
  unit?: string
  help?: string
  error?: string
  disabled?: boolean
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'decimal-pad' | 'phone-pad' | 'number-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  /**
   * OS autofill hint. `email`, `name`, `password`, `one-time-code` and the rest
   * let the platform offer the right saved value.
   */
  autoComplete?:
    | 'name'
    | 'email'
    | 'username'
    | 'password'
    | 'current-password'
    | 'new-password'
    | 'one-time-code'
    | 'off'
  /** iOS keyboard and autofill hint. Android reads `autoComplete`. */
  textContentType?: 'name' | 'emailAddress' | 'password' | 'newPassword' | 'oneTimeCode' | 'none'
  returnKeyType?: ReturnKeyTypeOptions
  onSubmitEditing?: () => void
  onFocus?: () => void
  onBlur?: () => void
  /** Rendered inside the field at the leading edge. */
  leading?: ReactNode
  inputRef?: Ref<TextInputInstance>
  className?: string
}

/**
 * 56px field. The frame (surface, border, radius, focus halo) belongs to the
 * wrapper and the text input is a transparent, vertically centred child of it.
 * A text input that owns its own height does not centre reliably across iOS and
 * Android: the frame centres it, so the text always sits on the middle line.
 */
export const Input = forwardRef<TextInputInstance, InputProps>(function Input(
  {
    label,
    value,
    onChangeText,
    placeholder,
    unit,
    help,
    error,
    disabled = false,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    autoCorrect,
    autoComplete,
    textContentType,
    returnKeyType = 'done',
    onSubmitEditing,
    onFocus,
    onBlur,
    leading,
    inputRef,
    className,
  },
  forwardedRef
) {
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

  return (
    <View className={cn('w-full gap-s2', className)}>
      {label ? <Text className="text-label font-rubik-bold mb-3 text-text">{label}</Text> : null}

      <Animated.View
        style={[frameStyle, haloStyle, surfaceStyle]}
        className={cn('h-[56px] w-full flex-row items-center justify-between rounded-lg border-2 px-s7')}
      >
        {leading ? <View className="pr-s3">{leading}</View> : null}

        <TextInput
          ref={forwardedRef ?? inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors['text-3']}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          editable={!disabled}
          onFocus={() => {
            setFocused(true)
            onFocus?.()
          }}
          onBlur={() => {
            setFocused(false)
            onBlur?.()
          }}
          submitBehavior={returnKeyType === 'next' ? 'submit' : 'blurAndSubmit'}
          underlineColorAndroid="transparent"
          className={cn(
            'min-h-0 flex-1 self-stretch bg-transparent p-0 text-base leading-[20px]',
            disabled ? 'text-text-3' : 'text-text'
          )}
          style={{
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            textAlignVertical: 'center',
            includeFontPadding: false,
          }}
        />

        {unit ? (
          <Text
            pointerEvents="none"
            className="pl-s3 text-sm font-rubik-medium text-text-3"
            style={{ lineHeight: 18 }}
          >
            {unit}
          </Text>
        ) : null}
      </Animated.View>

      {error ? (
        <Text className="text-sm mt-1 text-error-text">{error}</Text>
      ) : help ? (
        <Text className="text-sm mt-1 text-text-2">{help}</Text>
      ) : null}
    </View>
  )
})
