import type { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { CheckMark } from './Check'
import { Glyph, useQootIcon } from './Icon'
import { CaretRightIcon } from './icons'
import type { IconTone } from './ListRow'

const toneBox: Record<IconTone, string> = {
  orange: 'bg-tint-orange',
  green: 'bg-tint-green',
  yellow: 'bg-tint-yellow',
  sky: 'bg-tint-sky',
  berry: 'bg-tint-berry',
  '': '',
}

interface ChoiceRowProps {
  selected: boolean
  onSelect: () => void
  title: string
  sub?: string
  /** Icon tile beside the control. */
  icon?: ReactElement
  iconTone?: IconTone
  /** Trailing value or badge, e.g. `Light`. */
  value?: string
  /** Trailing affordance for rows that navigate. */
  navigate?: boolean
  /** Arbitrary trailing content, e.g. a goal glyph. */
  trailing?: ReactNode
  /** Card styling used by onboarding choices. */
  card?: boolean
  /** Overrides the title type scale. */
  titleClassName?: string
  accessibilityLabel?: string
  disabled?: boolean
  className?: string
}

/** A radio, a title, one muted line, and an optional chevron. */
export function ChoiceRow({
  selected,
  onSelect,
  title,
  sub,
  icon,
  iconTone = 'orange',
  value,
  navigate = false,
  trailing,
  card = false,
  titleClassName,
  accessibilityLabel,
  disabled = false,
  className,
}: ChoiceRowProps) {
  const caret = useQootIcon('text-2', 20, 'bold')
  const tileIcon = useQootIcon('primary-text', 20, 'bold')

  return (
    <Pressable
      accessibilityRole={navigate ? 'button' : 'radio'}
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={accessibilityLabel ?? title}
      disabled={disabled}
      onPress={onSelect}
      className={cn(
        'min-h-[44px] w-full flex-row items-center gap-s4 rounded-md px-s4 py-s3',
        card && 'min-h-[56px] rounded-xl border-2 px-s5 py-s4',
        card && (selected ? 'border-primary bg-primary-tint' : 'border-border-strong bg-surface'),
        disabled && 'opacity-50',
        className
      )}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
    >
      {icon ? (
        <View className={cn('h-10 w-10 items-center justify-center rounded-md', toneBox[iconTone])}>
          <Glyph icon={icon} {...tileIcon} />
        </View>
      ) : null}

      {navigate ? null : <CheckMark checked={selected} tone="round" />}

      <View className="flex-1">
        <Text className={cn('text-title text-text', titleClassName)}>{title}</Text>
        {sub ? <Text className="text-caption text-text-2">{sub}</Text> : null}
      </View>

      {value ? <Text className="text-sm font-rubik-semibold text-text">{value}</Text> : null}
      {trailing ? <View className="shrink-0">{trailing}</View> : null}
      {navigate ? <CaretRightIcon {...caret} /> : null}
    </Pressable>
  )
}
