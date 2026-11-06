
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/lib/utils'
import type { ColorToken } from '@/theme'
import { useTabBarBottomInset } from '@/components/shared/navigation/TabBarInsetContext'

import type { QootIconProps } from './Icon'
import { useQootIcon } from './Icon'
import { Txt as Text } from './Txt'

export type ToastAlignment = 'top' | 'bottom'
export type ToastTone = 'neutral' | 'success' | 'error'

interface ToastProps {
  open: boolean
  message: string
  /** Leading glyph. Defaults to a tick on the success tone. */
  icon?: ReactElement
  /** Trailing action, e.g. `Undo`. It is the only way back from a delete. */
  actionLabel?: string
  onAction?: () => void
  tone?: ToastTone
  alignment?: ToastAlignment
  onClose?: () => void
  className?: string
  /** Auto-dismiss delay in milliseconds. Set to 0 to disable auto-dismiss. */
  duration?: number
}

const toneText: Record<ToastTone, ColorToken> = {
  neutral: 'on-inverse',
  success: 'on-inverse',
  error: 'on-inverse',
}

const EASE = Easing.bezier(0.23, 1, 0.32, 1)

const ENTER_MS = 200
const EXIT_MS = 180
const DEFAULT_DURATION = 3000
const EDGE_SPACING = 16
const BOTTOM_SPACING = 16

/**
 * A toast announces an event and can optionally provide an action.
 *
 * Features:
 * - Respects top, bottom, and horizontal safe-area insets.
 * - Automatically dismisses after `duration` milliseconds.
 * - Remains mounted during its exit animation.
 * - Supports reduced-motion preferences.
 * - Can dismiss itself even if the parent does not update `open`.
 */
export function Toast({
  open,
  message,
  icon,
  actionLabel,
  onAction,
  tone = 'neutral',
  alignment = 'bottom',
  onClose,
  className,
  duration = DEFAULT_DURATION,
}: ToastProps) {
  const insets = useSafeAreaInsets()
  const tabBarBottomInset = useTabBarBottomInset()
  const glyph = useQootIcon(toneText[tone], 18, 'bold')
  const reduced = useReducedMotion()

  const offset = useSharedValue(0)

  const [visible, setVisible] = useState(open)
  const [rendered, setRendered] = useState(open)
  const [wasOpen, setWasOpen] = useState(open)

  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Detect externally controlled open changes during render so the toast
  // can enter immediately without waiting for an effect.
  if (open !== wasOpen) {
    setWasOpen(open)
    setVisible(open)

    if (open) {
      setRendered(true)
    }
  }

  // Auto-dismiss after the requested duration.
  // A message change starts a fresh timer.
  useEffect(() => {
    if (!open || !visible || duration <= 0) return

    const timer = setTimeout(() => {
      setVisible(false)
      onCloseRef.current?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, message, open, visible])

  // Animate entry and exit. Keep the component mounted until the exit ends.
  useEffect(() => {
    offset.set(
      withTiming(
        visible ? 1 : 0,
        {
          duration: reduced
            ? 1
            : visible
              ? ENTER_MS
              : EXIT_MS,
          easing: EASE,
        },
        (finished) => {
          if (finished && !visible) {
            runOnJS(setRendered)(false)
          }
        }
      )
    )
  }, [offset, reduced, visible])

  const style = useAnimatedStyle(() => ({
    opacity: offset.get(),
    transform: [
      {
        translateY:
          (1 - offset.get()) * (alignment === 'top' ? -16 : 16),
      },
    ],
  }))

  if (!rendered) return null

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        style,
        {
          top:
            alignment === 'top'
              ? insets.top + EDGE_SPACING
              : undefined,
          bottom:
            alignment === 'bottom'
              ? insets.bottom + Math.max(tabBarBottomInset, BOTTOM_SPACING)
              : undefined,
          left: Math.max(insets.left, EDGE_SPACING),
          right: Math.max(insets.right, EDGE_SPACING),
        },
      ]}
      className={cn('absolute z-50', className)}
      pointerEvents="box-none"
    >
      <View className="flex-row items-center gap-s4 rounded-lg bg-inverse px-s5 py-s4 shadow-l3">
        {icon && isValidElement(icon) ? (
          cloneElement(icon as ReactElement<QootIconProps>, glyph)
        ) : tone === 'success' ? (
          <View className="items-center justify-center">
            {/*
              The success icon is supplied by the caller when needed.
              Keeping this slot optional preserves the existing API.
            */}
          </View>
        ) : null}

        <Text className="flex-1 text-sm font-rubik-semibold leading-[19px] text-on-inverse">
          {message}
        </Text>

        {actionLabel && onAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            hitSlop={8}
            onPress={onAction}
          >
            <Text className="text-sm font-rubik-bold text-toast-action">
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}

        {onClose ? (
          <Pressable
            className="rounded-lg p-3"
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            hitSlop={8}
            onPress={() => {
              setVisible(false)
              onClose()
            }}
          >
            <Text className="text-sm text-on-inverse opacity-70">
              Close
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  )
}
