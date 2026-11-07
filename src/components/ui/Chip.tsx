import type { ReactElement } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'
import { Txt as Text } from './Txt'
import { LockSimpleIcon } from './icons'

interface ChipProps {
  label: string
  selected?: boolean
  locked?: boolean
  onPress?: () => void
  icon?: ReactElement
  disabled?: boolean
  size?: 'md' | 'sm'
  className?: string
}

/**
 * 40px pill. Selection is a plain style swap, nothing more.
 *
 * This was animated twice and both attempts read as flicker: interpolating
 * background, border and label colour meant a colour conversion per chip per
 * frame, and crossfading a selected layer meant a second chip-sized view per
 * chip. A chip is a 40px filter toggle touched a few times a minute; a tint change
 * is below the threshold where it needs to be a motion. The only motion left is a
 * 3% press scale.
 */
export function Chip({
  label,
  selected = false,
  locked = false,
  onPress,
  icon,
  disabled = false,
  size = 'md',
  className,
}: ChipProps) {
  const pressed = useSharedValue(0)
  const lockGlyph = useQootIcon('text-3', 13, 'bold')
  const iconGlyph = useQootIcon(selected ? 'primary-text' : 'text', 16, 'bold')

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.get() * 0.03 }],
  }))

  const surface = (
    <Animated.View
      style={pressStyle}
      className={cn(
        'flex-row items-center justify-center gap-s2 self-start rounded-full border-2',
        size === 'sm' ? 'h-8 px-s4' : 'h-10 px-s5',
        disabled
          ? 'border-transparent bg-surface-3'
          : selected
            ? 'border-primary bg-primary-tint'
            : 'border-border-strong bg-surface',
        className
      )}
    >
      {locked ? <LockSimpleIcon {...lockGlyph} /> : null}
      {icon ? <Glyph icon={icon} {...iconGlyph} /> : null}
      <Text
        className={cn(
          size === 'sm' ? 'text-xs' : 'text-sm',
          // Selected is the strongest read on the pill: bold primary-text on the
          // tint. Default stays text-text so the row reads as a calm set, and
          // locked/disabled sink to text-3. Disabled must win over locked.
          selected
            ? 'font-rubik-bold text-primary-text'
            : disabled
              ? 'font-rubik-semibold text-text-3'
              : locked
                ? 'font-rubik-semibold text-text-3'
                : 'font-rubik-semibold text-text-2'
        )}
      >
        {label}
      </Text>
    </Animated.View>
  )

  if (!onPress) return surface

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => pressed.set(1)}
      onPressOut={() => pressed.set(0)}
      pressRetentionOffset={12}
      className="self-start"
    >
      {surface}
    </Pressable>
  )
}

interface ChipRowProps<T extends string> {
  options: readonly { value: T; label: string; locked?: boolean }[]
  selected?: readonly T[]
  onChange?: (next: T[]) => void
  /** Single-select rows are mutually exclusive. */
  exclusive?: boolean
  scroll?: boolean
  size?: 'md' | 'sm'
  accessibilityLabel?: string
  className?: string
}

/**
 * Chips are also the component for every static reference list, so allergies and
 * diet options never become a row-per-item list with hairlines.
 */
export function ChipRow<T extends string>({
  options,
  selected = [],
  onChange,
  exclusive = false,
  scroll = false,
  size = 'md',
  accessibilityLabel,
  className,
}: ChipRowProps<T>) {
  const toggle = (value: T) => {
    if (!onChange) return
    if (exclusive) {
      onChange(selected.includes(value) ? [] : [value])
      return
    }
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  const chips = options.map((option) => (
    <Chip
      key={option.value}
      label={option.label}
      locked={option.locked}
      size={size}
      selected={selected.includes(option.value)}
      onPress={() => toggle(option.value)}
    />
  ))

  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-s2 px-s6 pb-s2"
        className={cn('-mx-s6', className)}
        accessibilityLabel={accessibilityLabel}
      >
        {chips}
      </ScrollView>
    )
  }

  return (
    <View accessibilityLabel={accessibilityLabel} className={cn('flex-row flex-wrap gap-s2', className)}>
      {chips}
    </View>
  )
}
