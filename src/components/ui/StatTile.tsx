import type { ReactElement } from 'react'
import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'

export type StatTone = 'orange' | 'green' | 'yellow' | 'sky' | 'berry'

const toneBox: Record<StatTone, string> = {
  orange: 'bg-tint-orange',
  green: 'bg-tint-green',
  yellow: 'bg-tint-yellow',
  sky: 'bg-tint-sky',
  berry: 'bg-tint-berry',
}

interface StatTileProps {
  label: string
  value: string
  sub?: string
  tone?: StatTone
  icon?: ReactElement
  className?: string
}

/** Compact metric tile: label, big number, one muted line. */
export function StatTile({ label, value, sub, tone = 'orange', icon, className }: StatTileProps) {
  const glyph = useQootIcon('text-2', 18, 'bold')
  return (
    <View className={cn('gap-s1 rounded-xl p-s5', toneBox[tone], className)}>
      <View className="h-18 flex-row items-start gap-s2">
        {icon ? <Glyph className='mt-1' icon={icon} {...glyph} /> : null}
        <Text className="text-caption font-rubik-bold text-text">{label}</Text>
      </View>
      <Text className="text-h2 font-rubik-bold text-text" numeric>
        {value}
      </Text>
      {sub ? <Text className="text-sm font-rubik-medium text-text-2">{sub}</Text> : null}
    </View>
  )
}
