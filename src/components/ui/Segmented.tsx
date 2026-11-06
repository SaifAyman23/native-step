import { useEffect, useState, type ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'
import { tapSelection } from '@/lib/haptics'

import { Glyph, useQootIcon } from './Icon'
import { Txt as Text } from './Txt'

const EASE = Easing.bezier(0.23, 1, 0.32, 1)

export interface SegmentOption<T extends string> {
  value: T
  label: string
  icon?: ReactElement
  disabled?: boolean
}

interface Frame {
  x: number
  width: number
}

interface SegmentedProps<T extends string> {
  value: T
  options: readonly SegmentOption<T>[]
  onChange: (value: T) => void
  /** Segments share the full width. */
  block?: boolean
  /** Pinned strip under a nav bar: shorter segments that fill the row. */
  subnav?: boolean
  accessibilityLabel?: string
  className?: string
}

/**
 * Segmented control with one pill that slides between segments.
 *
 * The pill is driven by the *active* segment's own measured frame, not by the last
 * one that happened to lay out. Segments are rarely equal width outside `block`
 * mode ("Week" against "Month" against "Year"), and reading a single shared
 * measurement made the pill land at the wrong size and offset, so it looked like
 * it belonged to a neighbouring tab. It stays invisible until every segment has
 * reported, which also removes the flash on first paint.
 *
 * The measurement lives in `Track`, keyed by the option list, so a changed set of
 * options remounts with a clean slate instead of animating from stale frames.
 */
export function Segmented<T extends string>(props: SegmentedProps<T>) {
  const signature = props.options.map((option) => option.value).join('|')
  return <Track key={signature} {...props} />
}

function Track<T extends string>({
  value,
  options,
  onChange,
  block = false,
  subnav = false,
  accessibilityLabel,
  className,
}: SegmentedProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )
  const activeIcon = useQootIcon('text', 17, 'bold')
  const idleIcon = useQootIcon('text-2', 17, 'bold')
  const reduced = useReducedMotion()

  const [frames, setFrames] = useState<Frame[]>([])

  const left = useSharedValue(0)
  const width = useSharedValue(0)
  const ready = useSharedValue(0)

  useEffect(() => {
    const frame = frames[activeIndex]
    if (!frame || frames.length !== options.length) return
    if (reduced) {
      left.set(frame.x)
      width.set(frame.width)
      ready.set(1)
      return
    }
    left.set(withTiming(frame.x, { duration: 240, easing: EASE }))
    width.set(withTiming(frame.width, { duration: 240, easing: EASE }))
    ready.set(withTiming(1, { duration: 120 }))
  }, [activeIndex, frames, options.length, ready, left, width, reduced])

  const pill = useAnimatedStyle(() => ({
    left: left.get(),
    width: width.get(),
    opacity: ready.get(),
  }))

  const measure = (index: number, frame: Frame) => {
    setFrames((current) => {
      if (current[index]?.x === frame.x && current[index]?.width === frame.width) return current
      const next = current.slice()
      next[index] = frame
      return next
    })
  }

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      className={cn(
        'flex-row gap-s1 self-start rounded-lg bg-surface-3 p-s2',
        block && 'w-full',
        subnav && 'w-full self-stretch',
        className
      )}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute bottom-s2 top-s2 rounded-md bg-surface shadow-l1"
        style={pill}
      />

      {options.map((option, index) => {
        const active = option.value === value
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: !!option.disabled }}
            accessibilityLabel={option.label}
            disabled={option.disabled}
            onPress={() => {
              if (option.value !== value) tapSelection()
              onChange(option.value)
            }}
            onLayout={(event) =>
              measure(index, {
                x: event.nativeEvent.layout.x,
                width: event.nativeEvent.layout.width,
              })
            }
            pressRetentionOffset={12}
            className={cn(
              'h-10 flex-row items-center justify-center gap-s2 rounded-md px-s6',
              block && 'flex-1 px-s3',
              subnav && 'h-9 flex-1 px-s2',
              option.disabled && 'opacity-50'
            )}
            style={({ pressed }) => (pressed && !option.disabled ? { opacity: 0.6 } : undefined)}
          >
            {option.icon ? <Glyph icon={option.icon} {...(active ? activeIcon : idleIcon)} /> : null}
            <Text className={cn('text-sm font-rubik-semibold', active ? 'text-text' : 'text-text-2')}>
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
