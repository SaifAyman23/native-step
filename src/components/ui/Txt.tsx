import { Text as RNText, type TextProps } from 'react-native'

import { cn } from '@/lib/utils'

export interface TxtProps extends TextProps {
  /** Tabular figures, so a changing number never reflows its neighbours. */
  numeric?: boolean
  /** Uppercase label styling for section captions. */
  tracking?: boolean
}

/**
 * Text primitive. Identical to the React Native `Text` plus `numeric`, which is
 * how every changing number in the app stays aligned.
 *
 * Defaults to `text-text` so raw RN `Text` (which renders black with no class)
 * and `Txt` both inherit the theme — the token is what makes text theme-aware.
 */
export function Txt({ numeric = false, tracking = false, className, style, ...rest }: TxtProps) {
  return (
    <RNText
      className={cn(tracking && 'tracking-[0.015em] font-rubik-bold', 'text-text', className)}
      style={[numeric ? { fontVariant: ['tabular-nums' as const] } : null, style]}
      {...rest}
    />
  )
}
