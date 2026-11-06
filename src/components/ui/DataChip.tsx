import type { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'

export type DataChipTone = 'p' | 'c' | 'f' | 'w'

interface DataChipProps {
  label: string
  tone: DataChipTone
  value?: string
  onPress?: () => void
  icon?: ReactElement
  className?: string
}

const toneBox: Record<DataChipTone, string> = {
  p: 'bg-protein',
  c: 'bg-carbs',
  f: 'bg-fat',
  w: 'bg-water',
}

const toneText: Record<DataChipTone, string> = {
  p: 'text-success-knob',
  c: 'text-warning-text',
  f: 'text-on-primary',
  w: 'text-on-primary',
}

const toneGlyph: Record<DataChipTone, Parameters<typeof useQootIcon>[0]> = {
  p: 'success-knob',
  c: 'warning-text',
  f: 'on-primary',
  w: 'on-primary',
}

/**
 * The brand data chip. Data colors belong to data only, never to a button
 * or a status, so this component never carries a press edge.
 */
export function DataChip({ label, tone, value, onPress, icon, className }: DataChipProps) {
  const glyph = useQootIcon(toneGlyph[tone], 16, 'bold')
  const body = (
    <>
      {icon ? <Glyph icon={icon} {...glyph} /> : null}
      <Text className={cn('text-sm font-rubik-bold', toneText[tone])}>
        {label}
        {value ? ` ${value}` : ''}
      </Text>
    </>
  )
  const shape = cn(
    'min-h-[44px] min-w-[72px] flex-row items-center justify-center gap-s1 self-start rounded-lg px-s4 py-s2',
    toneBox[tone],
    className
  )
  if (!onPress) return <View className={shape}>{body}</View>
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label} ${value}` : label}
      onPress={onPress}
      className={cn(shape, 'active:opacity-80')}
    >
      {body}
    </Pressable>
  )
}
