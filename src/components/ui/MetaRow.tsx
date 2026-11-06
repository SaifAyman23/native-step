import type { ReactElement } from 'react'
import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'

export interface MetaItem {
  icon: ReactElement
  label: string
}

interface MetaRowProps {
  items: readonly MetaItem[]
  /** Hairline above the row. Turn off when the row already sits under a divider. */
  divided?: boolean
  className?: string
}

/** Small facts beside a record, e.g. last log, linked since, view only. */
export function MetaRow({ items, divided = true, className }: MetaRowProps) {
  const glyph = useQootIcon('text-3', 15, 'bold')
  return (
    <View
      className={cn(
        'flex-row flex-wrap gap-x-s5 gap-y-s2',
        divided && 'border-t-[1.5px] border-border pt-s4',
        className
      )}
    >
      {items.map((item) => (
        <View key={item.label} className="flex-row items-center gap-[5px]">
          <Glyph icon={item.icon} {...glyph} />
          <Text className="text-sm text-text-2">{item.label}</Text>
        </View>
      ))}
    </View>
  )
}
