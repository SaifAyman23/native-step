import { View } from 'react-native'

import { cn } from '@/lib/utils'

import { Txt as Text } from './Txt'

export interface MicroItem {
  label: string
  value: string
}

interface MicroListProps {
  items: readonly MicroItem[]
  /**
   * `plain` splits the rows with a hairline. Use it in inline lists.
   * `pill` wraps each row in a bordered surface capsule. Use it on detail screens.
   */
  variant?: 'plain' | 'pill'
  className?: string
}

export function MicroList({ items, variant = 'plain', className }: MicroListProps) {
  if (variant === 'pill') {
    return (
      <View className={cn('gap-s2', className)}>
        {items.map((item) => (
          <View
            key={item.label}
            className="flex-row items-center justify-between gap-s4 rounded-full bg-surface px-s5 py-s3"
          >
            <Text className="text-caption font-rubik-medium text-text">{item.label}</Text>
            <Text className="text-caption font-rubik-bold text-text numeric">{item.value}</Text>
          </View>
        ))}
      </View>
    )
  }

  return (
    <View className={cn('gap-s3', className)}>
      {items.map((item, index) => (
        <View key={item.label} className="gap-s3">
          {index !== 0 ? <View className="h-1 w-full bg-surface-2" /> : null}
          <View className="flex-row items-center justify-between gap-s4">
            <Text className="text-caption font-rubik-medium text-text">{item.label}</Text>
            <Text className="text-caption font-rubik-bold text-text numeric">{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

/** Generic alias. */
export const KeyValueList = MicroList
