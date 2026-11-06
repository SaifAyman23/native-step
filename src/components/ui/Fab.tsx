import { cloneElement, isValidElement, useEffect, type ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import { cn } from '@/lib/utils'

import { useQootIcon } from './Icon'
import type { QootIconProps } from './Icon'
import { PressEdge, pressRadius } from './PressEdge'

interface FabProps {
  icon: ReactElement
  accessibilityLabel: string
  onPress?: () => void
  disabled?: boolean
  size?: 48 | 60
  className?: string
}

/**
 * Floating action button. It shares `PressEdge` with `Button`, so the resting
 * depth and the corner rounding are the same numbers rather than a lookalike.
 */
export function Fab({
  icon,
  accessibilityLabel,
  onPress,
  disabled = false,
  size = 48,
  className,
}: FabProps) {
  const pressed = useSharedValue(0)

  useEffect(() => {
    if (disabled) pressed.set(0)
  }, [disabled, pressed])

  const sink = useAnimatedStyle(() => ({ transform: [{ translateY: pressed.get() * 2 }] }))
  const iconProps = useQootIcon('on-primary', size === 60 ? 26 : 22)
  const box = size === 60 ? 'h-[60px] w-[60px]' : 'h-12 w-12'
  const radius = size === 60 ? 'xl' : 'md'

  return (
    <View className={cn('pb-s2', className)}>
      <PressEdge tone="bg-primary-edge" size={radius === 'xl' ? 'lg' : 'md'} />
      <Animated.View style={sink}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          onPressIn={() => pressed.set(1)}
          onPressOut={() => pressed.set(0)}
          pressRetentionOffset={12}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled }}
          className={cn(
            'items-center justify-center bg-primary',
            pressRadius[radius === 'xl' ? 'lg' : 'md'],
            box
          )}
        >
          {isValidElement(icon) ? cloneElement(icon as ReactElement<QootIconProps>, iconProps) : null}
        </Pressable>
      </Animated.View>
    </View>
  )
}
