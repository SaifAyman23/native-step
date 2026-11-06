import { Children, type ReactElement, type ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'

interface RowsProps {
  children: ReactNode
  /** Adds the 1.5px rule above each child except the first. */
  divided?: boolean
  className?: string
}

/**
 * Grouped rows. One divider direction, the first row has none. The surface and
 * radius live here so a group never needs its own card.
 */
export function Rows({ children, divided = true, className }: RowsProps) {
  const items = divided ? Children.toArray(children) : [children]
  return (
    <View className={cn('gap-3', className)}>
      {items.map((child, index) => (
        <View key={index} className={cn('border-2 bg-surface border-border rounded-lg')}>
          {child}
        </View>
      ))}
    </View>
  )
}

interface SectionHeadProps {
  title: string
  /** Optional glyph before the title. */
  icon?: ReactElement
  /** Trailing action, e.g. `See all`. */
  action?: string
  onActionPress?: () => void
  /** Muted trailing note, shown when there is no action. */
  caption?: string
  className?: string
}

/** Section header inside a scroll region. */
export function SectionHead({ title, icon, action, onActionPress, caption, className }: SectionHeadProps) {
  const glyph = useQootIcon('primary-text', 20, 'bold')
  return (
    <View className={cn('mt-s2 flex-row items-center justify-between gap-s3', className)}>
      <View className="min-w-0 flex-1 flex-row items-center gap-s4 mb-2">
        {icon ? <Glyph icon={icon} {...glyph} /> : null}
        <Text className="shrink text-h3 font-rubik-bold text-text">{title}</Text>
      </View>
      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action}
          onPress={onActionPress}
          hitSlop={8}
          className="min-h-[44px] justify-center px-s2"
        >
          <Text className="text-sm text-primary-text">{action}</Text>
        </Pressable>
      ) : caption ? (
        <Text className="text-caption text-text-3">{caption}</Text>
      ) : null}
    </View>
  )
}

/** Small caps label above a stacked group, used inside sheets and day groups. */
export function SectionLabel({
  children,
  variant = 'label',
  className,
}: {
  children: ReactNode
  /** `day` is the uppercase group header used between note days. */
  variant?: 'label' | 'day'
  className?: string
}) {
  return (
    <Text
      className={cn(
        'text-label text-text-3',
        variant === 'label' ? 'mt-s1' : 'uppercase tracking-[0.06em]',
        className
      )}
    >
      {children}
    </Text>
  )
}

/** Settings block: a muted label, then its rows. */
export function SettingsGroup({
  label,
  children,
  className,
}: {
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <View className={cn('gap-s3', className)}>
      {label ? <Text className="text-label font-rubik-semibold text-text-2">{label}</Text> : null}
      <Rows>{children}</Rows>
    </View>
  )
}
