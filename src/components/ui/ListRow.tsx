import { Image } from 'expo-image'
import type { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'
import { CaretRightIcon, ImageIcon } from './icons'

export type IconTone = 'orange' | 'green' | 'yellow' | 'sky' | 'berry' | ''
export type MacroTone = 'p' | 'c' | 'f'

const iconToneBox: Record<IconTone, string> = {
  orange: 'bg-tint-orange',
  green: 'bg-tint-green',
  yellow: 'bg-tint-yellow',
  sky: 'bg-tint-sky',
  berry: 'bg-tint-berry',
  '': '',
}

const macroToneText: Record<MacroTone, string> = {
  p: 'text-protein',
  c: 'text-carbs',
  f: 'text-fat',
}

const macroToneFill: Record<MacroTone, string> = {
  p: 'bg-protein',
  c: 'bg-carbs',
  f: 'bg-fat',
}

/** 40px tinted icon tile beside a row, or a bare glyph with no tile. */
export function IconTile({
  icon,
  tone = 'orange',
  plain = false,
  className,
}: {
  icon: ReactElement
  tone?: IconTone
  plain?: boolean
  className?: string
}) {
  const glyph = useQootIcon('primary-text', plain ? 24 : 20, 'bold')
  return (
    <View
      className={cn(
        'items-center justify-center',
        plain ? 'w-7 justify-self-center' : cn('h-10 w-10 rounded-md', iconToneBox[tone]),
        className
      )}
    >
      <Glyph icon={icon} {...glyph} />
    </View>
  )
}

/** 48px photo slot. A labelled placeholder, never a fake photo. */
export function Thumb({
  label = 'Food photo',
  uri,
  className,
}: {
  label?: string
  uri?: string
  className?: string
}) {
  const glyph = useQootIcon('text-3', 20, 'bold')
  const shape = cn(
    'h-12 w-12 overflow-hidden rounded-md border border-border',
    uri ? 'bg-surface-2' : 'items-center justify-center bg-surface-2',
    className
  )
  if (uri) {
    return (
      <View accessibilityRole="image" accessibilityLabel={label} className={shape}>
        <Image source={{ uri }} contentFit="cover" cachePolicy="memory-disk" style={{ width: '100%', height: '100%' }} />
      </View>
    )
  }
  return (
    <View accessibilityRole="image" accessibilityLabel={label} className={shape}>
      <Glyph icon={<ImageIcon />} {...glyph} />
    </View>
  )
}

/** Three macro labels beside a value. No separator string, ever. */
export function MacroLabels({
  protein,
  carbs,
  fat,
  goals,
  className,
}: {
  protein: number | null
  carbs: number | null
  fat: number | null
  /** Adds each macro's target: `76 / 128 g` instead of `76p`. */
  goals?: { protein: number | null; carbs: number | null; fat: number | null }
  className?: string
}) {
  const entries: [MacroTone, number | null, number | null | undefined][] = [
    ['p', protein, goals?.protein],
    ['c', carbs, goals?.carbs],
    ['f', fat, goals?.fat],
  ]
  return (
    <View className={cn('flex-row gap-s2', className)}>
      {entries.map(([tone, value, goal]) => (
        <Text key={tone} className={cn('text-caption font-rubik-bold', macroToneText[tone])} numeric>
          {value == null ? `—${tone}` : goal == null ? `${value}${tone}` : `${value} / ${goal} g`}
        </Text>
      ))}
    </View>
  )
}

/** A macro value with its colour dot, used in totals footers and pickers. */
export function MacroDots({
  protein,
  carbs,
  fat,
  unit = 'g',
  className,
}: {
  protein: number
  carbs: number
  fat: number
  unit?: string
  className?: string
}) {
  const entries: [MacroTone, number][] = [
    ['p', protein],
    ['c', carbs],
    ['f', fat],
  ]
  return (
    <View className={cn('flex-row items-center gap-s4', className)}>
      {entries.map(([tone, value]) => (
        <View key={tone} className="flex-row items-center gap-[6px]">
          <View className={cn('h-2 w-2 rounded-full', macroToneFill[tone])} />
          <Text className="text-caption font-rubik-bold text-text" numeric>
            {`${value}${unit}`}
          </Text>
        </View>
      ))}
    </View>
  )
}

/** Total: a rounded pill under the rows. Value starts, dots end. */
export function MealFooter({
  kcal,
  protein,
  carbs,
  fat,
  caption = 'kcal',
  className,
}: {
  kcal: number
  protein: number
  carbs: number
  fat: number
  /** Small label after the number, e.g. `kcal in this meal`. */
  caption?: string
  className?: string
}) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between gap-s4 rounded-full bg-surface-2 px-s5 py-s3',
        className
      )}
    >
      <View className="flex-row items-baseline gap-s2">
        <Text className="text-lg leading-[22px] font-rubik-bold text-text" numeric style={{ letterSpacing: -0.18 }}>
          {kcal.toLocaleString('en-US')}
        </Text>
        <Text className="text-xs font-rubik-medium text-text-3">{caption}</Text>
      </View>
      <MacroDots protein={protein} carbs={carbs} fat={fat} />
    </View>
  )
}

export interface ListRowProps {
  title: string
  sub?: string
  /** Any leading element, e.g. `<Thumb />`. Wins over `icon` and `thumbUri`. */
  leading?: ReactNode
  /** Tinted icon tile. Omit for a photo slot or nothing at all. */
  icon?: ReactElement
  iconTone?: IconTone
  iconPlain?: boolean
  thumbUri?: string
  macros?: { protein: number; carbs: number; fat: number }
  /** Trailing value with its unit under it, e.g. `230` over `kcal`. */
  value?: string
  valueUnit?: string
  /** Trailing control, e.g. a Switch. */
  trailing?: ReactNode
  /** Trailing chevron for rows that navigate. */
  navigate?: boolean
  /** Adds the `pending` tag after the title. */
  pending?: boolean
  onPress?: () => void
  accessibilityLabel?: string
  /** Spoken after the title, for a row whose destination is not obvious. */
  accessibilityHint?: string
  className?: string
}

/**
 * One divider direction, first row has none. A row shows the value at
 * the end with three metric labels beside it.
 */
export function ListRow({
  title,
  sub,
  leading,
  icon,
  iconTone = 'orange',
  iconPlain = false,
  thumbUri,
  macros,
  value,
  valueUnit,
  trailing,
  navigate = false,
  pending = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  className,
}: ListRowProps) {
  const caret = useQootIcon('text-2', 20, 'bold')

  const body = (
    <>
      {leading
        ? leading
        : thumbUri
          ? <Thumb uri={thumbUri} />
          : icon
            ? <IconTile icon={icon} tone={iconTone} plain={iconPlain} />
            : null}

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-s2">
          <Text className="shrink text-caption font-rubik-bold text-text">{title}</Text>
          {pending ? (
            <View className="rounded-xs bg-info-bg px-s2 py-[3px]">
              <Text className="font-rubik-semibold text-info-text">pending</Text>
            </View>
          ) : null}
        </View>
        {sub ? <Text className="text-sm text-text-2" numberOfLines={1} ellipsizeMode="tail">{sub}</Text> : null}
      </View>

      {macros ? <MacroLabels {...macros} /> : null}
      {value ? (
        <View className="items-end">
          <Text className="text-sm font-rubik-bold text-text" numeric style={{ lineHeight: 16 }}>
            {value}
          </Text>
          {valueUnit ? (
            <Text className="text-xs font-rubik-medium text-text-3">{valueUnit}</Text>
          ) : null}
        </View>
      ) : null}
      {trailing}
      {navigate ? <CaretRightIcon {...caret} /> : null}
    </>
  )

  const shape = cn('min-h-[60px] w-full flex-row items-center gap-s4 px-s5 py-s4', className)

  if (!onPress) return <View className={shape}>{body}</View>

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      className={shape}
      style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}
    >
      {body}
    </Pressable>
  )
}

/** Generic aliases for general metric rows and totals. */
export const MetricLabels = MacroLabels
export const MetricDots = MacroDots
export const TotalFooter = MealFooter
