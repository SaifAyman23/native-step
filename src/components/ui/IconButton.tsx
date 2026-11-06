import { cloneElement, type ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'
import type { ColorToken } from '@/theme'

import type { IconWeight, QootIconProps } from './Icon'
import { useQootIcon } from './Icon'


interface IconButtonProps {
  icon: ReactElement
  accessibilityLabel: string
  onPress?: () => void
  variant?: 'solid' | 'ghost'
  disabled?: boolean
  /** Functional count on a header bell, never decoration. */
  count?: number
  size?: 'md' | 'sm'
  iconWeight?: IconWeight
  /** Overrides the glyph size, e.g. 24px in a larger composer. */
  iconSize?: number
  /** Overrides the glyph colour, e.g. primary-text on a tonal button. */
  iconTone?: ColorToken
  /** Spoken after the label, for a control whose effect is not obvious. */
  accessibilityHint?: string
  className?: string
}

/** 48 by 48 so the target clears the 44px minimum. */
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'solid',
  disabled = false,
  count,
  size = 'md',
  iconWeight = 'bold',
  iconSize,
  iconTone,
  accessibilityHint,
  className,
}: IconButtonProps) {
  const glyphSize = iconSize ?? (size === 'sm' ? 18 : 20)
  const iconProps = useQootIcon(disabled ? 'text-3' : iconTone ?? 'text', glyphSize, iconWeight)

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      className={cn(
        'items-center justify-center rounded-lg relative',
        size === 'sm' ? 'h-11 w-11' : 'h-12 w-12',
        variant === 'ghost'
          ? 'border-b-4 border-transparent bg-transparent'
          : 'border-2 border-border-strong bg-surface',
        disabled && 'border-transparent bg-surface-3',
        className
      )}
      style={({ pressed }) =>
        pressed && !disabled && variant === 'solid'
          ? { transform: [{ translateY: 3 }], borderBottomWidth: 1 }
          : undefined
      }
    >
      {cloneElement(icon as ReactElement<QootIconProps>, iconProps)}
      {count != null && count > 0 ? (
        <View className="absolute right-[3px] top-[3px] min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-[5px]">
          <Text className="text-xs font-rubik-bold text-on-primary" style={{ lineHeight: 18 }} numeric>
            {count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  )
}
