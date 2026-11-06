import type { ReactElement } from 'react'
import { View } from 'react-native'

import { cn } from '@/lib/utils'

import { Button } from './Button'
import { Glyph, useQootIcon } from './Icon'
import { Txt as Text } from './Txt'

export type EmptyHeroTone = 'orange' | 'green' | 'sky'

const tileTone: Record<EmptyHeroTone, { box: string; glyph: Parameters<typeof useQootIcon>[0] }> = {
  orange: { box: 'bg-tint-orange', glyph: 'tint-orange-t' },
  green: { box: 'bg-tint-green', glyph: 'success-text' },
  sky: { box: 'bg-tint-sky', glyph: 'info-text' },
}

interface EmptyHeroProps {
  icon: ReactElement
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
  tone?: EmptyHeroTone
  className?: string
}

/** The teaching empty state: one glyph tile, one sentence, one action. */
export function EmptyHero({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  tone = 'orange',
  className,
}: EmptyHeroProps) {
  const spec = tileTone[tone]
  const glyph = useQootIcon(spec.glyph, 40, 'bold')
  return (
    <View
      className={cn(
        'items-center gap-s3 rounded-2xl border border-border bg-surface px-s5 pb-s5 pt-s7',
        className
      )}
    >
      <View className={cn('h-[84px] w-[84px] items-center justify-center rounded-2xl', spec.box)}>
        <Glyph icon={icon} {...glyph} />
      </View>
      <Text className="text-h2 text-center text-text">{title}</Text>
      <Text className="max-w-[32ch] text-center text-body text-text-2">{body}</Text>
      {actionLabel ? (
        <Button title={actionLabel} onPress={onAction} className="mt-s3" />
      ) : null}
    </View>
  )
}
