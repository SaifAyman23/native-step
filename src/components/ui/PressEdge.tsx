import { View } from 'react-native'

import { cn } from '@/lib/utils'

import type { ButtonSize } from './Button'

/** Resting depth of the edge. Every pressable in the app uses this number. */
export const PRESS_EDGE_HEIGHT = 22

/**
 * Bottom-corner radius of the edge, matching the button it sits under.
 *
 * This is an element rather than a `border-bottom` because a border paints square
 * corners on Android whatever radius the box has, which leaves a button looking
 * chipped where the rounding should be.
 */
const edgeRadius: Record<ButtonSize, string> = {
  sm: 'rounded-b-md',
  md: 'rounded-b-lg',
  lg: 'rounded-b-xl',
}

/** The button's own radius, so the edge lines up with it exactly. */
export const pressRadius: Record<ButtonSize, string> = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
}

/**
 * The press edge for `Button`, `Fab` and the `TabBar` centre action.
 *
 * Place it as the first child of a container that reserves `PRESS_EDGE_HEIGHT` of
 * bottom padding, and give it `inset-x-0`: the container's width *is* the button's
 * width, so the edge can never be wider or narrower than the thing it sits under.
 * The button is rendered after it and sinks on press, thinning the visible edge.
 */
export function PressEdge({
  size = 'md',
  tone,
  className,
}: {
  size?: ButtonSize
  /** A `bg-*` class, from the same palette as the button it sits under. */
  tone: string
  className?: string
}) {
  return (
    <View
      pointerEvents="none"
      style={{ height: PRESS_EDGE_HEIGHT }}
      className={cn('absolute inset-x-0 bottom-0', edgeRadius[size], tone, className)}
    />
  )
}
