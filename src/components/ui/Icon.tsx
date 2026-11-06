import { cloneElement, isValidElement, type ReactElement } from 'react'
import { View } from 'react-native'
import { useMemo } from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { cn } from '@/lib/utils'
import { useThemeColors, type ColorToken } from '@/theme'

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

/** Mirrors the Phosphor icon props so any glyph is a drop-in child. */
export interface QootIconProps {
  color?: string
  duotoneColor?: string
  duotoneOpacity?: number
  mirrored?: boolean
  size?: string | number
  weight?: IconWeight
  style?: StyleProp<ViewStyle | Omit<TextStyle, 'cursor'>>
  testID?: string
  title?: string
}

/**
 * Phosphor glyphs need a resolved color string rather than a Tailwind class, so
 * tokens are looked up through `useThemeColors` and spread onto the glyph.
 */
export function useQootIcon(tone: ColorToken = 'text', size = 20, weight: IconWeight = 'bold'): QootIconProps {
  const colors = useThemeColors()
  return useMemo(() => ({ color: colors[tone], size, weight }), [colors, tone, size, weight])
}

interface GlyphProps extends QootIconProps {
  /** The Phosphor component. Its own props are overridden by the token props. */
  icon: ReactElement
  className?: string
}

/**
 * Renders a Phosphor glyph at the themed colour, size and weight. Use this
 * wherever a component accepts an `icon` prop: spreading the props onto a
 * wrapper `View` leaves the glyph at its own defaults.
 */
export function Glyph({ icon, className, ...props }: GlyphProps) {
  if (!isValidElement(icon)) return null
  return (
    <View className={cn('shrink-0', className)}>
      {cloneElement(icon as ReactElement<QootIconProps>, props)}
    </View>
  )
}
