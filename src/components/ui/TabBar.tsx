import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { cloneElement, isValidElement, useEffect, useState, type ReactElement } from 'react'
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import { cn } from '@/lib/utils'
import { useResolvedScheme } from '@/store/theme/themeStore'
import tokens from '@/theme/tokens'

import type { QootIconProps } from './Icon'
import { useQootIcon } from './Icon'
import { PressEdge } from './PressEdge'
import { Txt as Text } from './Txt'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface TabItem<T extends string> {
  key: T
  label: string
  icon: ReactElement
  badge?: number
}

/**
 * The floating tab bar: a glass pill with an optional raised centre action.
 *
 * The centre action sits in the middle of the bar, so when it is present the
 * tab list should be an even number. Four tabs give two either side, which is
 * the shape the design uses; an odd count cannot be centred and the action
 * drifts. Without a centre action the tabs share one row.
 */
export function TabBar<T extends string>({
  tabs,
  activeKey,
  onChange,
  centerIcon,
  centerLabel,
  onCenterPress,
  onHeightChange,
  floating = true,
  /** Bottom safe-area inset in dp. A floating bar must clear the home indicator. */
  bottomInset = 0,
  /** Left/right safe-area insets in dp; the bar clears them with a 22px floor. */
  leftInset = 0,
  rightInset = 0,
  className,
}: {
  tabs: readonly TabItem<T>[]
  activeKey: T
  onChange: (key: T) => void
  /** Optional centre action. When absent the tabs fill the row. */
  centerIcon?: ReactElement
  centerLabel?: string
  onCenterPress?: () => void
  onHeightChange?: (height: number) => void
  /** Pinned above the content so the scroll runs behind it. */
  floating?: boolean
  bottomInset?: number
  leftInset?: number
  rightInset?: number
  className?: string
}) {
  const idle = useQootIcon('text-2', 22, 'bold')
  const active = useQootIcon('primary-text', 22, 'bold')
  const plus = useQootIcon('on-primary', 22, 'bold')
  const centre = useSharedValue(0)
  const scheme = useResolvedScheme()

  useEffect(() => {
    const id = setTimeout(() => centre.set(0), 120)
    return () => clearTimeout(id)
  }, [centre])

  const centreStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: centre.get() * 2 }],
  }))

  const pick = (key: T) => {
    void Haptics.selectionAsync()
    onChange(key)
  }

  const before = Math.floor(tabs.length / 2)

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(event) => onHeightChange?.(event.nativeEvent.layout.height)}
      style={
        floating
          ? {
              position: 'absolute',
              left: Math.max(leftInset, 22),
              right: Math.max(rightInset, 22),
              bottom: 0,
              paddingBottom: bottomInset + tokens.spacing.s3,
            }
          : undefined
      }
      className={cn(floating ? 'px-s4' : undefined, className)}
    >
      <View className="overflow-hidden rounded-xl border border-border shadow-l2">
        <BlurView
          intensity={70}
          tint={scheme}
          blurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill as StyleProp<ViewStyle>}
        />

        <View className="flex-row items-center gap-s1 px-s3 py-s3">
          {centerIcon && onCenterPress ? (
            <>
              <View className="flex-1 flex-row items-center justify-around gap-s1">
                {tabs.slice(0, before).map((tab) => (
                  <Tab
                    key={tab.key}
                    label={tab.label}
                    glyph={tab.icon}
                    iconProps={tab.key === activeKey ? active : idle}
                    selected={tab.key === activeKey}
                    badge={tab.badge}
                    onPress={() => pick(tab.key)}
                  />
                ))}
              </View>

              <View className="h-12 w-12 items-center justify-center pb-s2">
                <View className="absolute inset-0 items-center justify-center rounded-xl bg-primary-tint">
                  <PressEdge tone="bg-primary-edge" />
                </View>
                <AnimatedPressable
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    onCenterPress()
                  }}
                  onPressIn={() => centre.set(1)}
                  onPressOut={() => centre.set(0)}
                  pressRetentionOffset={12}
                  accessibilityRole="button"
                  accessibilityLabel={centerLabel}
                  className="h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-l1"
                  style={centreStyle}
                >
                  {isValidElement(centerIcon)
                    ? cloneElement(centerIcon as ReactElement<QootIconProps>, plus)
                    : null}
                </AnimatedPressable>
              </View>

              <View className="flex-1 flex-row items-center justify-around gap-s1">
                {tabs.slice(before).map((tab) => (
                  <Tab
                    key={tab.key}
                    label={tab.label}
                    glyph={tab.icon}
                    iconProps={tab.key === activeKey ? active : idle}
                    selected={tab.key === activeKey}
                    badge={tab.badge}
                    onPress={() => pick(tab.key)}
                  />
                ))}
              </View>
            </>
          ) : (
            <View className="flex-1 flex-row items-center justify-around gap-s1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  label={tab.label}
                  glyph={tab.icon}
                  iconProps={tab.key === activeKey ? active : idle}
                  selected={tab.key === activeKey}
                  badge={tab.badge}
                  onPress={() => pick(tab.key)}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

function Tab({
  label,
  glyph,
  iconProps,
  selected,
  badge,
  onPress,
}: {
  label: string
  glyph: ReactElement
  iconProps: QootIconProps
  selected: boolean
  badge?: number
  onPress: () => void
}) {
  const [pressed, setPressed] = useState(0)
  const scale = useSharedValue(1)

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }))

  useEffect(() => {
    scale.set(pressed ? 0.94 : 1)
  }, [pressed, scale])

  return (
    <AnimatedPressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => setPressed(1)}
      onPressOut={() => setPressed(0)}
      pressRetentionOffset={16}
      className={cn(
        'min-h-[44px] min-w-[52px] w-fit items-center justify-center gap-[3px] rounded-md px-s3 py-[6px]',
        selected && 'bg-primary-tint-2'
      )}
      style={style}
    >
      <View>
        {isValidElement(glyph) ? cloneElement(glyph as ReactElement<QootIconProps>, iconProps) : null}
        {badge != null && badge > 0 ? (
          <View className="absolute -right-s3 -top-s2 min-h-[18px] min-w-[18px] items-center justify-center rounded-sm bg-primary px-s1">
            <Text className="text-xs font-rubik-bold text-on-primary" style={{ lineHeight: 18 }} numeric>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        className={cn('text-xs font-rubik-semibold', selected ? 'text-primary-text' : 'text-text-2')}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  )
}
