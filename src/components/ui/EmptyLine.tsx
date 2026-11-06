import type { ReactElement } from 'react'
import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'

interface EmptyLineProps {
  icon: ReactElement
  title: string
  /** Why it is empty, in one line. */
  sub?: string
  className?: string
}

/** An empty state that still names the thing that is missing. */
export function EmptyLine({ icon, title, sub, className }: EmptyLineProps) {
  const glyph = useQootIcon('text-3', 22, 'bold')
  return (
    <View
      className={cn(
        'flex-row items-center gap-s3 rounded-xl border border-dashed border-border-strong bg-surface-2 p-s4',
        className
      )}
    >
      <Glyph icon={icon} {...glyph} />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-rubik-bold text-text">{title}</Text>
        {sub ? <Text className="mt-[1px] text-caption text-text-2">{sub}</Text> : null}
      </View>
    </View>
  )
}
