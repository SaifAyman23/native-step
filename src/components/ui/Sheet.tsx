import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  BackHandler,
  Keyboard,
  Pressable,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native'
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/lib/utils'
import { tokens, useThemeColors } from '@/theme'
import { Button } from './Button'
import { Glyph, useQootIcon } from './Icon'
import { CaretLeftIcon } from './icons'
import { SearchInput } from './SearchInput'
import { useSheet } from './SheetHost'
import { Txt as Text } from './Txt'

const EASE_SHEET = Easing.bezierFn(0.22, 1, 0.36, 1)
const EASE_STEP = Easing.bezierFn(0.32, 0.72, 0, 1)

const OPEN_MS = 520
const CLOSE_MS = 400
const STEP_MS = 560
const FOOTER_MS = 280
const FOOTER_OFFSET = 10

const HEIGHT_SETTLE_MS = 100
const HEIGHT_MS = 460
const TRANSITION_SETTLE_MS = 40
const MIN_SYNC_MS = 200

const OUTGOING_TRAVEL = 0.3
const OUTGOING_DIM = 0.45

const KEYBOARD_GAP = 12
const TOP_GAP = 8
const MIN_PANEL_HEIGHT = 200
const STAGE_UNBOUNDED = 100000

const FIXED_PANEL_HEIGHT_SCALE = 0.72
const EXPAND_DRAG_DISTANCE = 180
const EXPAND_THRESHOLD = 0.35
const EXPAND_SNAP_MS = 320

const DRAG_ACTIVATION_DISTANCE = 10
const DRAG_HORIZONTAL_TOLERANCE = 30

const fixedSheetHeights = new Map<string, number>()

const dismissKeyboard = () => Keyboard.dismiss()

// Height of the touch strip along the top edge of the sheet that holds the
// grabber. The whole strip (full width) drags the sheet.
const HANDLE_HIT_HEIGHT = 44
const HANDLE_BAR_HEIGHT = 4

// Lets content inside a sheet (e.g. SheetPicker) ask its surface to become
// expandable without the call site having to pass the prop to the surface.
const SheetExpandableContext = createContext<
  ((expandable: boolean) => void) | null
>(null)

type StepTransition = { endsAt: number }

function useFollowedHeight(
  reduceMotion: boolean,
  transition: { current: StepTransition | null },
  enabled = true
) {
  const height = useSharedValue(0)
  const target = useSharedValue(0)
  const measured = useSharedValue(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!enabled) return

      const next = event.nativeEvent.layout.height

      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }

      if (!measured.get()) {
        height.set(next)
        target.set(next)
        measured.set(true)
        return
      }

      if (Math.abs(next - target.get()) < 0.5) return

      const slideLeft = () =>
        transition.current ? transition.current.endsAt - Date.now() : 0

      timer.current = setTimeout(
        () => {
          timer.current = null
          target.set(next)

          if (reduceMotion) {
            height.set(next)
            return
          }

          const left = slideLeft()

          height.set(
            withTiming(next, {
              duration: left > MIN_SYNC_MS ? left : HEIGHT_MS,
              easing: EASE_STEP,
            })
          )
        },
        slideLeft() > MIN_SYNC_MS
          ? TRANSITION_SETTLE_MS
          : HEIGHT_SETTLE_MS
      )
    },
    [enabled, height, measured, reduceMotion, target, transition]
  )

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
      cancelAnimation(height)
    },
    [height]
  )

  const style = useAnimatedStyle(() => {
    if (!enabled || !measured.get()) {
      return { minHeight: 0, maxHeight: STAGE_UNBOUNDED }
    }

    const h = height.get()
    return { minHeight: h, maxHeight: h }
  })

  return { style, onLayout }
}

interface SheetSurfaceProps {
  title?: string
  /** Action rendered at the trailing edge of the title line, e.g. a heart. */
  titleAccessory?: ReactNode
  sectionLabel?: string
  children: ReactNode
  footer?: ReactNode
  dismissible?: boolean
  onClosed: () => void
  className?: string

  /**
   * Locks the sheet to a fixed height shared by every sheet using the same
   * `fixedHeightKey`. When combined with `expandable`, this height becomes
   * the collapsed (minimum) height.
   */
  fixedHeight?: boolean
  fixedHeightKey?: string

  /**
   * Lets the sheet expand to the available screen height when the user
   * drags it upward. Works on its own (the natural content height is the
   * collapsed height) or together with `fixedHeight` (the fixed height is
   * the collapsed height).
   */
  expandable?: boolean
}

export function SheetSurface({
  title,
  titleAccessory,
  sectionLabel,
  children,
  footer,
  dismissible = true,
  onClosed,
  className,
  fixedHeight = false,
  fixedHeightKey,
  expandable: expandableProp = false,
}: SheetSurfaceProps) {
  // Content such as `<SheetPicker expandable />` can also switch this on.
  const [childExpandable, setChildExpandable] = useState(false)
  const expandable = expandableProp || childExpandable

  const insets = useSafeAreaInsets()
  const { width, height: windowHeight } = useWindowDimensions()
  const colors = useThemeColors()
  const reduceMotion = useReducedMotion()
  const [closing, setClosing] = useState(false)

  const {
    motion,
    canGoBack,
    back,
    registerDismissHandler,
  } = useSheet()

  if (fixedHeight && !fixedHeightKey) {
    throw new Error(
      'SheetSurface: fixedHeightKey is required when fixedHeight is enabled.'
    )
  }

  const isBackTransition = motion.direction === 'back'
  const direction = isBackTransition ? -1 : 1

  const openMs = reduceMotion ? 1 : OPEN_MS
  const closeMs = reduceMotion ? 1 : CLOSE_MS
  const stepMs = reduceMotion ? 1 : STEP_MS
  const footerMs = reduceMotion ? 1 : FOOTER_MS

  const onClosedRef = useRef(onClosed)

  useEffect(() => {
    onClosedRef.current = onClosed
  }, [onClosed])

  const finishClose = useCallback(() => {
    onClosedRef.current()
  }, [])

  const keyboard = useAnimatedKeyboard()

  const step = useMemo(
    () => (
      <>
        {canGoBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={12}
            onPress={back}
            className="-ml-s3 -mt-s2 h-11 w-11 items-center justify-center self-start"
          >
            <CaretLeftIcon
              size={22}
              weight="bold"
              color={colors['text-2']}
            />
          </Pressable>
        ) : null}

        {sectionLabel ? (
          <Text className="text-label text-text-3">{sectionLabel}</Text>
        ) : null}

        {title ? (
          <View className="flex-row items-center gap-s3">
            <Text className="flex-1 text-h1 font-rubik-bold text-text">{title}</Text>
            {titleAccessory}
          </View>
        ) : null}

        <View className="min-h-0 gap-s4">{children}</View>
      </>
    ),
    [back, canGoBack, children, colors, sectionLabel, title, titleAccessory]
  )

  const previous = useRef(step)
  const lastVersion = useRef(motion.version)
  const [outgoing, setOutgoing] = useState<ReactNode>(null)

  const slide = useSharedValue(1)
  const footerProgress = useSharedValue(0)

  const transition = useRef<StepTransition | null>(null)
  const scrollRef = useRef<any>(null)
  const scrollGestureRef = useRef<typeof ScrollView>(ScrollView)

  const clearOutgoing = useCallback(() => {
    transition.current = null
    setOutgoing(null)
  }, [])

  // Expansion progress: 0 = collapsed height, 1 = full screen height.
  const expansionProgress = useSharedValue(0)

  // The collapsed height of the panel, used as the floor that expansion
  // grows from.
  const collapsedPanelHeight = useSharedValue(0)

  // Track the starting expansion state of each drag.
  const dragStartExpanded = useSharedValue(false)

  // Fade and lift the footer in when the sheet first appears.
  useEffect(() => {
    footerProgress.set(
      withTiming(1, {
        duration: footerMs,
        easing: EASE_SHEET,
      })
    )
  }, [footerMs, footerProgress])

  // Animate between steps without unmounting the outgoing screen too early.
  useLayoutEffect(() => {
    if (lastVersion.current === motion.version) return

    lastVersion.current = motion.version

    if (motion.direction === 'none') return

    transition.current = { endsAt: Date.now() + stepMs }

    setOutgoing(previous.current)
    scrollRef.current?.scrollTo?.({ y: 0, animated: false })

    cancelAnimation(slide)
    slide.set(0)
    slide.set(
      withTiming(
        1,
        {
          duration: stepMs,
          easing: EASE_STEP,
        },
        (finished) => {
          if (finished) {
            runOnJS(clearOutgoing)()
          }
        }
      )
    )

    cancelAnimation(footerProgress)
    footerProgress.set(0)
    footerProgress.set(
      withTiming(1, {
        duration: footerMs,
        easing: EASE_SHEET,
      })
    )
  }, [
    clearOutgoing,
    footerMs,
    footerProgress,
    motion.direction,
    motion.version,
    slide,
    stepMs,
  ])

  useLayoutEffect(() => {
    previous.current = step
  })

  const incomingStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: (1 - slide.get()) * direction * width,
        },
      ],
    })
  )

  const outgoingStyle = useAnimatedStyle(
    () => ({
      opacity: isBackTransition
        ? 1
        : 1 - OUTGOING_DIM * slide.get(),
      transform: [
        {
          translateX: isBackTransition
            ? slide.get() * width
            : -slide.get() * direction * width * OUTGOING_TRAVEL,
        },
      ],
    })
  )

  const footerAnimationStyle = useAnimatedStyle(() => ({
    opacity: footerProgress.get(),
    transform: [
      {
        translateY: (1 - footerProgress.get()) * FOOTER_OFFSET,
      },
    ],
  }))

  const fixedPanelHeight = useMemo(() => {
    if (!fixedHeight || !fixedHeightKey) return 0

    const availableHeight = Math.max(
      MIN_PANEL_HEIGHT,
      windowHeight - insets.top - TOP_GAP
    )

    const desiredHeight = Math.min(
      windowHeight * FIXED_PANEL_HEIGHT_SCALE,
      availableHeight
    )

    const cached = fixedSheetHeights.get(fixedHeightKey)

    if (cached != null && Math.abs(cached - desiredHeight) < 1) {
      return cached
    }

    fixedSheetHeights.set(fixedHeightKey, desiredHeight)
    return desiredHeight
  }, [fixedHeight, fixedHeightKey, insets.top, windowHeight])

  useEffect(() => {
    if (fixedHeight && fixedPanelHeight > 0) {
      collapsedPanelHeight.set(fixedPanelHeight)
    }
  }, [collapsedPanelHeight, fixedHeight, fixedPanelHeight])

  const stage = useFollowedHeight(
    reduceMotion,
    transition,
    !fixedHeight
  )

  const footerBox = useFollowedHeight(
    reduceMotion,
    transition,
    !fixedHeight
  )

  const translateY = useSharedValue(0)
  const dragStart = useSharedValue(0)
  const dragAnchor = useSharedValue(0)
  const dragOwned = useSharedValue(false)
  const panelHeight = useSharedValue(0)
  const hasMeasured = useSharedValue(false)
  const isClosing = useSharedValue(false)
  const scrollY = useSharedValue(0)

  const animateOut = useCallback(
    (velocity: number) => {
      'worklet'

      if (isClosing.get()) return

      isClosing.set(true)
      runOnJS(setClosing)(true)

      const target =
        panelHeight.get() + Math.max(keyboard.height.value, 0)

      const done = (finished?: boolean) => {
        'worklet'

        if (finished) {
          runOnJS(finishClose)()
        }
      }

      if (velocity > 0) {
        translateY.set(
          withSpring(
            target,
            {
              velocity,
              damping: 40,
              stiffness: 260,
              mass: 1,
              overshootClamping: true,
            },
            done
          )
        )
      } else {
        translateY.set(
          withTiming(
            target,
            {
              duration: closeMs,
              easing: EASE_SHEET,
            },
            done
          )
        )
      }
    },
    [
      closeMs,
      finishClose,
      isClosing,
      keyboard,
      panelHeight,
      translateY,
    ]
  )

  const close = useCallback(() => {
    if (!dismissible) return

    Keyboard.dismiss()
    animateOut(0)
  }, [animateOut, dismissible])

  useEffect(() => {
    registerDismissHandler(close)

    return () => {
      registerDismissHandler(null)
    }
  }, [close, registerDismissHandler])

  useEffect(() => {
    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (closing) return true

        if (canGoBack) {
          back()
          return true
        }

        if (dismissible) {
          close()
        }

        return true
      }
    )

    return () => sub.remove()
  }, [back, canGoBack, close, closing, dismissible])

  useEffect(
    () => () => {
      cancelAnimation(translateY)
      cancelAnimation(slide)
      cancelAnimation(footerProgress)
      cancelAnimation(expansionProgress)
    },
    [expansionProgress, footerProgress, slide, translateY]
  )

  // Reset expansion whenever this surface mounts.
  useEffect(() => {
    expansionProgress.set(0)
  }, [expansionProgress])

  /* eslint-disable react-hooks/refs */
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!closing)
        // The grabber's touch target is a real 44dp full-width strip inside
        // the panel (see `grabber`), not hitSlop: Android drops touches that
        // land outside the parent's bounds, so slop above the panel's top
        // edge never reached the gesture.
        // A tap or a small finger movement must not activate the pan.
        // The gesture activates only after moving beyond this vertical range.
        .activeOffsetY([
          -DRAG_ACTIVATION_DISTANCE,
          DRAG_ACTIVATION_DISTANCE,
        ])
        // Fail the pan if the user is primarily moving horizontally.
        .failOffsetX([
          -DRAG_HORIZONTAL_TOLERANCE,
          DRAG_HORIZONTAL_TOLERANCE,
        ])
        // Keep the sheet gesture compatible with the inner ScrollView.
        .simultaneousWithExternalGesture(scrollGestureRef)
        .onStart(() => {
          dragStart.set(translateY.get())
          dragStartExpanded.set(expansionProgress.get() >= 0.5)
          dragAnchor.set(0)
          dragOwned.set(false)
        })
        .onUpdate((event) => {
          if (isClosing.get()) return

          // Expanded: dragging down collapses. An expandable sheet drags
          // from its grabber, so the scroll position is irrelevant.
          if (dragStartExpanded.get()) {
            if (!expandable && scrollY.get() > 1) {
              dragAnchor.set(event.translationY)
              return
            }

            const dy = event.translationY - dragAnchor.get()
            if (dy <= 0) return

            dragOwned.set(true)
            expansionProgress.set(
              Math.max(
                0,
                Math.min(1, 1 - dy / EXPAND_DRAG_DISTANCE)
              )
            )
            return
          }

          // Collapsed: dragging up expands the sheet.
          if (expandable && event.translationY < 0) {
            dragOwned.set(true)
            expansionProgress.set(
              Math.min(1, -event.translationY / EXPAND_DRAG_DISTANCE)
            )
            return
          }

          // Collapsed: finger came back down past the start point, so the
          // partial expansion is undone before the drag turns into a dismiss.
          if (expandable && expansionProgress.get() > 0) {
            expansionProgress.set(0)
          }

          // Collapsed: dragging down dismisses.
          if (!dismissible) return

          if (!dragOwned.get()) {
            if (!expandable && scrollY.get() > 1) {
              dragAnchor.set(event.translationY)
              return
            }

            if (event.translationY - dragAnchor.get() <= 0) return

            dragOwned.set(true)
          }

          translateY.set(
            Math.max(
              0,
              dragStart.get() + event.translationY - dragAnchor.get()
            )
          )
        })
        .onEnd((event) => {
          if (isClosing.get() || !dragOwned.get()) return

          const snap = (to: 0 | 1) => {
            'worklet'

            expansionProgress.set(
              withTiming(to, {
                duration: reduceMotion ? 1 : EXPAND_SNAP_MS,
                easing: EASE_SHEET,
              })
            )
          }

          // Was expanded at drag start: collapse or stay expanded.
          if (dragStartExpanded.get()) {
            const dy = event.translationY - dragAnchor.get()

            snap(
              dy > EXPAND_DRAG_DISTANCE * EXPAND_THRESHOLD ||
                event.velocityY > 500
                ? 0
                : 1
            )
            return
          }

          // Was collapsed and the drag expanded it: expand or spring back.
          if (expandable && expansionProgress.get() > 0) {
            snap(
              event.translationY <
                -EXPAND_DRAG_DISTANCE * EXPAND_THRESHOLD ||
                event.velocityY < -500
                ? 1
                : 0
            )
            return
          }

          // Otherwise this was a dismiss drag.
          const shouldClose =
            translateY.get() > panelHeight.get() * 0.28 ||
            event.velocityY > 900

          if (shouldClose) {
            runOnJS(dismissKeyboard)()
            animateOut(Math.max(event.velocityY, 0))
          } else {
            translateY.set(
              withSpring(0, {
                damping: 30,
                stiffness: 300,
                mass: 0.9,
                overshootClamping: true,
              })
            )
          }
        }),
    [
      animateOut,
      closing,
      dismissible,
      dragAnchor,
      dragOwned,
      dragStart,
      dragStartExpanded,
      expandable,
      expansionProgress,
      isClosing,
      panelHeight,
      reduceMotion,
      scrollY,
      translateY,
    ]
  )
  /* eslint-enable react-hooks/refs */

  const scrimStyle = useAnimatedStyle(() => {
    const h = panelHeight.get()

    if (!hasMeasured.get() || h <= 0) {
      return { opacity: 0 }
    }

    const hidden = Math.min(
      Math.max(translateY.get() / h, 0),
      1
    )

    return { opacity: 1 - hidden }
  })

  const panelStyle = useAnimatedStyle(() => {
    const kb = Math.max(keyboard.height.value, 0)

    const lift =
      kb > 0
        ? Math.max(kb - insets.bottom + KEYBOARD_GAP, 0)
        : 0

    const available = Math.max(
      MIN_PANEL_HEIGHT,
      windowHeight - insets.top - TOP_GAP - lift
    )

    const progress = expandable ? expansionProgress.get() : 0

    const common = {
      opacity: hasMeasured.get() ? 1 : 0,
      transform: [{ translateY: translateY.get() - lift }],
    }

    if (fixedHeight && fixedPanelHeight > 0) {
      const base = Math.min(fixedPanelHeight, available)
      const current = base + (available - base) * progress

      return {
        ...common,
        minHeight: current,
        maxHeight: current,
      }
    }

    const base = Math.min(collapsedPanelHeight.get(), available)
    const current = base + (available - base) * progress

    return {
      ...common,
      maxHeight: available,
      minHeight: progress > 0 ? current : 0,
    }
  })

  const handlePanelLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const next = event.nativeEvent.layout.height

      panelHeight.set(next)

      if (!fixedHeight && expansionProgress.get() === 0 && next > 0) {
        collapsedPanelHeight.set(next)
      }

      if (!hasMeasured.get() && next > 0) {
        translateY.set(next)
        hasMeasured.set(true)

        translateY.set(
          withTiming(0, {
            duration: openMs,
            easing: EASE_SHEET,
          })
        )
      }
    },
    [
      collapsedPanelHeight,
      expansionProgress,
      fixedHeight,
      hasMeasured,
      openMs,
      panelHeight,
      translateY,
    ]
  )

  // The handle sits in a full-width strip pulled up over the panel's top
  // padding and down over the start of the content, so it is 44dp tall and
  // fully inside the panel, while the bar itself keeps its original spot.
  const grabber = (
    <View
      collapsable={false}
      className="-mx-s6 items-center"
      style={{
        height: HANDLE_HIT_HEIGHT,
        paddingTop: tokens.spacing.s3,
        marginTop: -tokens.spacing.s3,
        marginBottom:
          tokens.spacing.s3 +
          HANDLE_BAR_HEIGHT +
          tokens.spacing.s2 -
          HANDLE_HIT_HEIGHT,
      }}
    >
      <View
        className="w-10 rounded-full bg-border-strong"
        style={{ height: HANDLE_BAR_HEIGHT }}
      />
    </View>
  )

  // An expandable sheet is dragged by the grabber alone, so the content
  // keeps its own touches. Every other sheet stays draggable anywhere.
  const withDrag = (panel: ReactNode) =>
    expandable ? (
      <>{panel}</>
    ) : (
      <GestureDetector gesture={pan}>{panel}</GestureDetector>
    )

  return (
    <SheetExpandableContext.Provider value={setChildExpandable}>
    <View className="absolute inset-0">
      <Animated.View
        pointerEvents={dismissible && !closing ? 'auto' : 'none'}
        style={scrimStyle}
        className="absolute inset-0 bg-scrim"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          disabled={!dismissible || closing}
          onPress={close}
          className="flex-1"
        />
      </Animated.View>

      {withDrag(
        <Animated.View
          onLayout={handlePanelLayout}
          accessibilityViewIsModal
          style={[
            panelStyle,
            { paddingBottom: insets.bottom },
          ]}
          className={cn(
            'absolute inset-x-0 bottom-0 gap-s4 rounded-t-2xl bg-surface px-s6 pt-s3 shadow-l3',
            className
          )}
        >
          {expandable ? (
            <GestureDetector gesture={pan}>{grabber}</GestureDetector>
          ) : (
            grabber
          )}

          <View
            className={cn(
              '-mx-s6 min-h-0',
              fixedHeight
                ? 'flex-1'
                : expandable
                  ? 'shrink grow'
                  : 'shrink'
            )}
          >
            <ScrollView
              ref={scrollRef}
              style={
                fixedHeight || expandable
                  ? { flex: 1 }
                  : { flexShrink: 1 }
              }
              contentContainerStyle={
                fixedHeight || expandable
                  ? { flexGrow: 1 }
                  : undefined
              }
              bounces={false}
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              onScroll={(event) =>
                scrollY.set(event.nativeEvent.contentOffset.y)
              }
            >
              <Animated.View
                style={[
                  stage.style,
                  fixedHeight
                    ? {
                        minHeight: 0,
                        maxHeight: STAGE_UNBOUNDED,
                      }
                    : null,
                ]}
                className="relative overflow-hidden"
              >
                {outgoing != null ? (
                  <>
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        incomingStyle,
                        {
                           zIndex: 0,
                         },
                      ]}
                      className="absolute inset-0 bg-surface"
                    />

                    <Animated.View
                      pointerEvents="none"
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
                      style={[
                        outgoingStyle,
                        {
                           zIndex: isBackTransition ? 3 : 1,
                        },
                      ]}
                      className="absolute inset-x-0 top-0 gap-s4 bg-surface px-s6"
                    >
                      {outgoing}
                    </Animated.View>

                    <Animated.View
                      onLayout={stage.onLayout}
                      style={[
                        incomingStyle,
                        {
                           zIndex: isBackTransition ? 1 : 3,
                        },
                      ]}
                      className="gap-s4 bg-surface px-s6"
                    >
                      {step}
                    </Animated.View>
                  </>
                ) : (
                  <Animated.View
                    onLayout={stage.onLayout}
                    className="gap-s4 px-s6"
                  >
                    {step}
                  </Animated.View>
                )}
              </Animated.View>
            </ScrollView>
          </View>

          {fixedHeight ? (
            <Animated.View
              style={footerAnimationStyle}
              className={cn(
                'gap-s2',
                footer ? 'pt-s4' : null
              )}
            >
              {footer}
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                footerBox.style,
                footerAnimationStyle,
              ]}
              className="-mt-s4 overflow-hidden"
            >
              <View
                onLayout={footerBox.onLayout}
                className={cn(
                  'gap-s2',
                  footer ? 'pt-s4' : null
                )}
              >
                {footer}
              </View>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
    </SheetExpandableContext.Provider>
  )
}

export interface SheetOption {
  value: string
  label: string
  sub?: string
  icon?: ReactElement
}

interface SheetPickerBase {
  options: readonly SheetOption[]
  /**
   * Shows a search field above the list. Left undefined, the search appears
   * once the list is long enough to need it.
   */
  searchable?: boolean
  className?: string
  /** Lets the enclosing sheet be dragged up by its handle to full height. */
  expandable?: boolean
  /** Shown when a search matches nothing. */
  emptyLabel?: string
  /** Called when the confirm action is pressed. Multi mode only. */
  onConfirm?: () => void
}

export type SheetPickerProps =
  | (SheetPickerBase & {
      multiple?: false
      value?: string
      onChange: (value: string) => void
    })
  | (SheetPickerBase & {
      multiple: true
      value: string[]
      onChange: (value: string[]) => void
    })

/** A list this long or longer gets a search field without being asked. */
const SEARCH_THRESHOLD = 12

/**
 * The standard selection sheet: single or multi select, searchable when the
 * list is long, and a confirm action in multi mode.
 *
 * A single choice applies on the tap, the way a picker should. A multi choice
 * is staged, because picking three allergies and losing them to a stray tap
 * would be worse than one extra tap.
 */
export function SheetPicker(props: SheetPickerProps) {
  const {
    options,
    className,
    expandable = false,
    emptyLabel = 'Nothing to pick',
    onConfirm,
  } = props
  const multiple = props.multiple === true
  const [query, setQuery] = useState('')

  const idleIcon = useQootIcon('text-2', 20, 'bold')
  const activeIcon = useQootIcon('primary-text', 20, 'bold')
  const setSheetExpandable = useContext(SheetExpandableContext)

  useLayoutEffect(() => {
    if (!expandable || !setSheetExpandable) return

    setSheetExpandable(true)
    return () => setSheetExpandable(false)
  }, [expandable, setSheetExpandable])

  const selected: string[] =
    props.multiple === true ? props.value : props.value === undefined ? [] : [props.value]

  const searchable = props.searchable ?? options.length > SEARCH_THRESHOLD

  const needle = query.trim().toLowerCase()
  const filtered =
    needle === ''
      ? options
      : options.filter(
          (option) =>
            option.label.toLowerCase().includes(needle) ||
            option.sub?.toLowerCase().includes(needle)
        )

  const pick = (optionValue: string) => {
    if (props.multiple === true) {
      const current = props.value
      props.onChange(
        current.includes(optionValue)
          ? current.filter((item) => item !== optionValue)
          : [...current, optionValue]
      )
      return
    }
    props.onChange(optionValue)
  }

  return (
    <View className={cn('gap-s2', className)}>
      {searchable ? (
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          className="mb-s2"
        />
      ) : null}

      {filtered.map((option) => {
        const active = selected.includes(option.value)

        return (
          <Pressable
            key={option.value}
            accessibilityRole={multiple ? 'checkbox' : 'radio'}
            accessibilityState={{ checked: active }}
            accessibilityLabel={option.label}
            onPress={() => pick(option.value)}
            className={cn(
              'min-h-[44px] w-full flex-row items-center gap-s5 rounded-md px-s4 py-s3',
              active && 'bg-primary-tint'
            )}
          >
            {option.icon ? (
              <Glyph
                icon={option.icon}
                {...(active ? activeIcon : idleIcon)}
                size={tokens.spacing.s7}
              />
            ) : null}

            <View className="flex-1">
              <Text
                className={cn(
                  'text-caption font-rubik-bold',
                  active ? 'text-primary-text' : 'text-text'
                )}
              >
                {option.label}
              </Text>

              {option.sub ? (
                <Text className="text-caption text-text-2">
                  {option.sub}
                </Text>
              ) : null}
            </View>
          </Pressable>
        )
      })}

      {filtered.length === 0 ? (
        <Text className="px-s2 py-s3 text-caption text-text-3">{emptyLabel}</Text>
      ) : null}

      {multiple ? (
        <Button
          title={
            props.value.length === 0
              ? 'Select at least one'
              : `Confirm ${props.value.length} selected`
          }
          block
          disabled={props.value.length === 0}
          onPress={onConfirm}
        />
      ) : null}
    </View>
  )
}
