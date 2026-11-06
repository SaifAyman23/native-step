import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { I18nManager, Pressable, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

const DEFAULT_REVEAL_WIDTH = 96
const FLICK_VELOCITY = 500
const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) }
/** Swipe toward the trailing edge: left in LTR, right in RTL. */
const DIR = I18nManager.isRTL ? 1 : -1

/** Only one row stays open at a time. */
let activeClose: (() => void) | null = null

interface DragRowProps {
  children: ReactNode
  /** Called by the Delete button in the revealed area, never by the swipe. */
  onDelete: () => void
  deleteLabel?: string
  /** Set false to render a permanently revealed row. */
  draggable?: boolean
  /** Width of the revealed Delete area. */
  revealWidth?: number
  /** Outer wrapper. Clips its children, so put roundness, margins and shadows here. e.g. "rounded-2xl" */
  className?: string
  /** The row surface that slides over the button. Background and its own roundness. e.g. "bg-surface rounded-2xl" */
  surfaceClassName?: string
  /** The Delete button. Background, roundness, border. e.g. "bg-error rounded-2xl" */
  actionClassName?: string
  /** The Delete label. */
  actionTextClassName?: string
}

interface ActionProps {
  onDelete: () => void
  label: string
  width: number
  className?: string
  textClassName?: string
}

function DeleteButton({ onDelete, label, width, className, textClassName }: ActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onDelete}
      style={{ width }}
      className={cn('h-full items-center justify-center bg-error rounded-sm active:opacity-80', className)}
    >
      <Text className={cn('text-sm font-rubik-bold text-on-primary', textClassName)}>{label}</Text>
    </Pressable>
  )
}

export function DragRow({
  children,
  onDelete,
  deleteLabel = 'Delete',
  draggable = true,
  revealWidth = DEFAULT_REVEAL_WIDTH,
  className,
  surfaceClassName = 'bg-surface',
  actionClassName,
  actionTextClassName,
}: DragRowProps) {
  if (!draggable) {
    return (
      <View className={cn('flex-row overflow-hidden', className)}>
        <View className={cn('min-w-0 flex-1', surfaceClassName)}>{children}</View>
        <DeleteButton
          onDelete={onDelete}
          label={deleteLabel}
          width={revealWidth}
          className={actionClassName}
          textClassName={actionTextClassName}
        />
      </View>
    )
  }

  return (
    <SwipeableBody
      onDelete={onDelete}
      deleteLabel={deleteLabel}
      revealWidth={revealWidth}
      className={className}
      surfaceClassName={surfaceClassName}
      actionClassName={actionClassName}
      actionTextClassName={actionTextClassName}
    >
      {children}
    </SwipeableBody>
  )
}

function SwipeableBody({
  children,
  onDelete,
  deleteLabel,
  revealWidth,
  className,
  surfaceClassName,
  actionClassName,
  actionTextClassName,
}: {
  children: ReactNode
  onDelete: () => void
  deleteLabel: string
  revealWidth: number
  className?: string
  surfaceClassName: string
  actionClassName?: string
  actionTextClassName?: string
}) {
  // How far the row is revealed: 0 (closed) to revealWidth (open).
  const pos = useSharedValue(0)
  const startPos = useSharedValue(0)
  const [open, setOpen] = useState(false)

  const close = useCallback(() => {
    pos.set(withTiming(0, TIMING))
    setOpen(false)
  }, [pos])

  const onSettled = useCallback(
    (next: boolean) => {
      setOpen(next)
      if (next) {
        if (activeClose && activeClose !== close) activeClose()
        activeClose = close
      } else if (activeClose === close) {
        activeClose = null
      }
    },
    [close],
  )

  useEffect(
    () => () => {
      if (activeClose === close) activeClose = null
    },
    [close],
  )

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      startPos.set(pos.get())
    })
    .onUpdate((event) => {
      const next = startPos.get() + DIR * event.translationX
      pos.set(Math.min(revealWidth, Math.max(0, next)))
    })
    .onEnd((event) => {
      const velocity = DIR * event.velocityX // positive = toward open
      let shouldOpen = pos.get() > revealWidth / 2
      if (velocity > FLICK_VELOCITY) shouldOpen = true
      else if (velocity < -FLICK_VELOCITY) shouldOpen = false
      pos.set(withTiming(shouldOpen ? revealWidth : 0, TIMING))
      runOnJS(onSettled)(shouldOpen)
    })

  const front = useAnimatedStyle(() => ({
    transform: [{ translateX: DIR * pos.get() }],
  }))

  // The action area is exactly as wide as the gap the row has opened.
  // At rest its width is 0, so there is nothing behind the row to show.
  const actionArea = useAnimatedStyle(() => ({ width: pos.get() }))

  return (
    <View className={cn('overflow-hidden', className)}>
      <Animated.View
        style={[{ position: 'absolute', top: 0, bottom: 0, end: 0, overflow: 'hidden' }, actionArea]}
      >
        {/* Fixed-size button anchored to the end, so it reveals instead of squashing */}
        <View style={{ position: 'absolute', top: 0, bottom: 0, end: 0, width: revealWidth }}>
          <DeleteButton
            onDelete={onDelete}
            label={deleteLabel}
            width={revealWidth}
            className={actionClassName}
            textClassName={actionTextClassName}
          />
        </View>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={front} className={surfaceClassName}>
          {children}
          {open && (
            // While open, a tap anywhere on the row closes it instead of pressing the content.
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={StyleSheet.absoluteFill}
              onPress={() => {
                close()
                onSettled(false)
              }}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}