import { Text as RNText, type TextProps } from 'react-native'

import { cn } from '@/lib/utils'
import { typography, type TypographyVariant } from '@/theme'

export type Script = 'en' | 'ar'

interface AppTextProps extends TextProps {
  /** DESIGN.md section 4 type ramp. Defaults to `body`. */
  variant?: TypographyVariant
  /** Arabic runs about 10% taller so descenders and diacritics never clip. */
  script?: Script
  /** Tabular figures for changing numbers. */
  numeric?: boolean
  /** Latin headings tighten and small text opens a hair. Arabic gets neither,
   *  because letter-spacing fights the joining of an Arabic word. */
  track?: boolean
}

const TIGHT_TRACKING: Partial<Record<TypographyVariant, number>> = {
  display: -0.025 * 36,
  h1: -0.02 * 28,
  h2: -0.015 * 22,
  h3: -0.005 * 18,
  metricXl: -0.03 * 48,
  metricLg: -0.02 * 32,
  metricMd: -0.01 * 22,
}

const OPEN_TRACKING: Partial<Record<TypographyVariant, number>> = {
  label: 0.015 * 12,
  caption: 0.015 * 12,
}

/** Themed text primitive. Color comes from the `text-*` tokens via className. */
export function AppText({
  variant = 'body',
  script = 'en',
  numeric = false,
  track = true,
  className,
  style,
  ...rest
}: AppTextProps) {
  const base = typography[variant]
  const latin = track && script === 'en'
  const letterSpacing = latin
    ? (TIGHT_TRACKING[variant] ?? OPEN_TRACKING[variant] ?? base.letterSpacing ?? 0)
    : 0
  const lineHeight = script === 'ar' ? Math.round((base.lineHeight ?? 0) * 1.1) : base.lineHeight

  return (
    <RNText
      className={cn('text-text', className)}
      style={[
        base,
        { lineHeight, letterSpacing },
        numeric ? { fontVariant: ['tabular-nums'] } : null,
        style,
      ]}
      {...rest}
    />
  )
}
