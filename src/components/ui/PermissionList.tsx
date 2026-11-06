import type { ReactElement } from 'react'
import { View } from 'react-native'

import { cn } from '@/lib/utils'

import { Card } from './Card'
import { Glyph, useQootIcon } from './Icon'
import { Txt as Text } from './Txt'

export type PermissionTone = 'yes' | 'no' | 'neutral'

export interface PermissionItem {
  icon: ReactElement
  text: string
  /** `yes` is a green tick, `no` a muted cross, `neutral` plain body copy. */
  tone?: PermissionTone
}

interface PermissionListProps {
  items: readonly PermissionItem[]
  /** Small caps heading above the statements. */
  label?: string
  className?: string
}

/** Plain-language statements of what another person can and cannot do. */
export function PermissionList({ items, label, className }: PermissionListProps) {
  const glyph = {
    yes: useQootIcon('success', 20, 'regular'),
    no: useQootIcon('text-3', 20, 'regular'),
    neutral: useQootIcon('text-2', 20, 'regular'),
  }

  return (
    <Card className={cn('gap-s5', className)}>
      {label ? <Text className="text-label text-text-2">{label}</Text> : null}
      {items.map((item) => (
        <View key={item.text} className="flex-row items-center gap-s4">
          <Glyph icon={item.icon} className='' {...glyph[item.tone ?? 'neutral']} />
          <Text className="min-w-0 flex-1 text-body font-rubik-medium text-text">{item.text}</Text>
        </View>
      ))}
    </Card>
  )
}
