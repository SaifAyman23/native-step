import type { ReactElement } from 'react'
import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'
import { FireIcon, LockSimpleIcon } from './icons'

export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'locked'

interface BadgeProps {
  label?: string
  /** @deprecated Use `label`. */
  text?: string
  tone?: BadgeTone
  icon?: ReactElement
  className?: string
}

const tone: Record<BadgeTone, { box: string; text: string; glyph: Parameters<typeof useQootIcon>[0] }> = {
  neutral: { box: 'bg-surface-3', text: 'text-text-2', glyph: 'text-2' },
  brand: { box: 'bg-tint-orange', text: 'text-tint-orange-t', glyph: 'tint-orange-t' },
  success: { box: 'bg-success-bg', text: 'text-success-text', glyph: 'success-text' },
  warning: { box: 'bg-warning-bg', text: 'text-warning-text', glyph: 'warning-text' },
  error: { box: 'bg-error-bg', text: 'text-error-text', glyph: 'error-text' },
  info: { box: 'bg-info-bg', text: 'text-info-text', glyph: 'info-text' },
  locked: { box: 'bg-surface-3', text: 'text-text-3', glyph: 'text-3' },
}

/** 26px pill. A real label or a real number, never decoration. */
export function Badge({ label, text, tone: name = 'neutral', icon, className }: BadgeProps) {
  const spec = tone[name]
  const glyph = useQootIcon(spec.glyph, 13, 'bold')
  return (
    <View
      className={cn(
        'h-[26px] flex-row items-center gap-s2 self-start rounded-full px-[10px]',
        spec.box,
        className
      )}
    >
      {icon ? (
        <Glyph icon={icon} {...glyph} />
      ) : name === 'locked' ? (
        <LockSimpleIcon {...glyph} />
      ) : null}
      <Text className={cn('text-xs', spec.text)}>{label ?? text}</Text>
    </View>
  )
}

/** Streak counter, always paired with its real number of days. */
export function StreakBadge({
  days,
  short = false,
  className,
}: {
  days: number
  short?: boolean
  className?: string
}) {
  const glyph = useQootIcon('tint-orange-t', 13, 'bold')
  return (
    <View
      accessibilityLabel={`${days} day streak`}
      className={cn(
        'h-[26px] flex-row items-center gap-s2 self-start rounded-full bg-tint-orange px-[10px]',
        className
      )}
    >
      <Glyph icon={<FireIcon />} {...glyph} />
      <Text className="text-label text-tint-orange-t">
        {short ? days : `${days} days`}
      </Text>
    </View>
  )
}
