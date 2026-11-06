import { Image } from 'expo-image'
import { useState, type ReactNode } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'
import { ImageIcon, LockSimpleIcon } from './icons'

interface CardMediaProps {
  uri?: string
  /** Labelled placeholder text. A slot is never a hand-built fake screenshot. */
  label?: string
  /** Explicit height. When omitted the slot keeps the 4 by 3 photo ratio. */
  height?: number
  ratio?: number
  rounded?: boolean
  className?: string
}

/** Image slot shared by the recipe and food cards. Measured, so 4 by 3 is real. */
export function CardMedia({
  uri,
  label = 'Photo, licensed',
  height,
  ratio = 4 / 3,
  rounded = false,
  className,
}: CardMediaProps) {
  const glyph = useQootIcon('text-3', 26, 'bold')
  const [measured, setMeasured] = useState(0)
  const measuredHeight = Math.round((measured * 3) / 4)
  const box = height ?? (measured > 0 ? measuredHeight : undefined)
  const frame = rounded ? 'rounded-md border border-border' : 'border-b-[1.5px] border-border'

  return (
    <View
      onLayout={(event) => setMeasured(event.nativeEvent.layout.width)}
      style={{ height: box }}
      className={cn('w-full overflow-hidden bg-surface-2 rounded-lg border-0', frame, className)}
    >
      {uri ? (
        <Image
          source={{ uri }}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessibilityLabel={label}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <View className="h-full w-full items-center justify-center gap-s2 px-s4">
          <Glyph icon={<ImageIcon />} {...glyph} />
          {label ? <Text className="text-center text-xs text-text-3">{label}</Text> : null}
        </View>
      )}
    </View>
  )
}

interface RecipeCardProps {
  title: string
  /** Muted line under the name, e.g. `640 kcal, 42 g protein`. */
  sub?: string
  uri?: string
  /** The large card in an asymmetric grid. */
  lead?: boolean
  /** Fixed width for a horizontal scroller. */
  width?: number
  /** Pro lock badge in the corner of the slot. */
  lockedLabel?: string
  onPress?: () => void
  className?: string
}

/** A card is only used where it is a real surface. At most two above the fold. */
export function RecipeCard({
  title,
  sub,
  uri,
  lead = false,
  width,
  lockedLabel,
  onPress,
  className,
}: RecipeCardProps) {
  const lock = useQootIcon('tint-orange-t', 13, 'bold')
  const body = (
    <>
      <CardMedia uri={uri} label={lockedLabel ?? 'Food photo, 4 by 3'} />
      {lockedLabel ? (
        <View className="absolute left-s3 top-s3 flex-row items-center gap-s1 rounded-full bg-tint-orange px-s3 py-s2">
            <Glyph icon={<LockSimpleIcon />} {...lock} />
          <Text className="text-xs font-rubik-semibold text-tint-orange-t">{lockedLabel}</Text>
        </View>
      ) : null}
      <View className="gap-s2 px-s4 py-s4">
        <Text className="text-caption font-rubik-medium text-text">{title}</Text>
        {sub ? <Text className="text-sm text-text-2">{sub}</Text> : null}
      </View>
    </>
  )

  const shape = cn(
    'overflow-hidden rounded-xl border border-0',
    width ? 'shrink-0' : 'w-full',
    className
  )

  if (!onPress) return <View style={width ? { width } : undefined} className={shape}>{body}</View>
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sub ? `${title}, ${sub}` : title}
      onPress={onPress}
      style={width ? { width } : undefined}
      className={cn(shape, 'active:opacity-80')}
    >
      {body}
    </Pressable>
  )
}

interface FoodCardProps {
  title: string
  sub?: string
  uri?: string
  width?: number
  onPress?: () => void
  className?: string
}

/** The recipe card's shape at a smaller size, for foods and recipe ingredients. */
export function FoodCard({ title, sub, uri, width = 128, onPress, className }: FoodCardProps) {
  const glyph = useQootIcon('text-3', 22, 'bold')
  const media = uri ? (
    <Image
      source={{ uri }}
      contentFit="cover"
      cachePolicy="memory-disk"
      accessibilityLabel={`${title} photo`}
      style={{ width, height: Math.round((width * 3) / 4) }}
      className="rounded-md border border-border bg-surface-2"
    />
  ) : (
    <View
      accessibilityRole="image"
      accessibilityLabel={`${title} photo`}
      style={{ width, height: Math.round((width * 3) / 4) }}
      className="items-center justify-center rounded-md border border-border bg-surface-2"
    >
      <Glyph icon={<ImageIcon />} {...glyph} />
    </View>
  )

  const body = (
    <>
      {media}
      <View className="mt-s2 gap-s1">
        <Text className="text-caption font-rubik-medium text-text" numberOfLines={2}>
          {title}
        </Text>
        {sub ? <Text className="text-caption text-text-2">{sub}</Text> : null}
      </View>
    </>
  )

  if (!onPress) return <View style={{ width }} className={className}>{body}</View>
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sub ? `${title}, ${sub}` : title}
      onPress={onPress}
      style={{ width }}
      className={cn('self-start active:opacity-80', className)}
    >
      {body}
    </Pressable>
  )
}

/** Horizontal card scroller that bleeds to the screen edges. */
export function HScroll({
  children,
  bleed = true,
  className,
}: {
  children: ReactNode
  bleed?: boolean
  className?: string
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={140}
      decelerationRate="fast"
      contentContainerClassName="gap-s3 px-s6 pb-s2"
      className={cn(bleed && '-mx-s6', className)}
    >
      {children}
    </ScrollView>
  )
}

interface LimitCell {
  name: string
  value: string
  sub: string
  locked?: boolean
  onPress?: () => void
}

const LIMIT_PRESS_EASE = Easing.bezier(0.23, 1, 0.32, 1)

function LimitCellView({ cell }: { cell: LimitCell }) {
  const pressed = useSharedValue(0)
  const reduced = useReducedMotion()

  const pressedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.get() * 0.03 }],
  }))

  const body = (
    <>
      <Text className={cn('text-xs font-rubik-semibold leading-[14px]', cell.locked ? 'text-text-3' : 'text-text-2')}>
        {cell.name}
      </Text>
      <Text className={cn('text-xl font-rubik-bold leading-[22px]', cell.locked ? 'text-text-3' : 'text-text')} numeric>
        {cell.value}
      </Text>
      <Text className="text-xs font-rubik-medium leading-[13px] text-text-3">{cell.sub}</Text>
    </>
  )

  const shape = cn(
    'w-[47.5%] gap-s2 rounded-lg border-dashed border border-border bg-surface p-s5',
    cell.locked && 'border-transparent bg-surface-2'
  )

  if (!cell.onPress) {
    return <View className={shape}>{body}</View>
  }

  const animate = (to: number) => {
    pressed.set(
      reduced ? to : withTiming(to, { duration: 120, easing: LIMIT_PRESS_EASE })
    )
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${cell.name}, ${cell.value}, ${cell.sub}`}
      onPress={cell.onPress}
      onPressIn={() => animate(1)}
      onPressOut={() => animate(0)}
      pressRetentionOffset={8}
      className="w-[47.5%]"
    >
      <Animated.View style={pressedStyle} className={cn(shape, 'w-full')}>
        {body}
      </Animated.View>
    </Pressable>
  )
}

/**
 * Nine plan limits in a two column grid, never nine rows with hairline dividers,
 * because a long list with a rule under every row is the lazy default.
 */
export function LimitGrid({ cells, className }: { cells: readonly LimitCell[]; className?: string }) {
  return (
    <View className={cn('flex-row flex-wrap gap-s3', className)}>
      {cells.map((cell) => (
        <LimitCellView key={cell.name} cell={cell} />
      ))}
    </View>
  )
}

/** Generic aliases. Media cards for any content. */
export const MediaCard = RecipeCard
export const CompactMediaCard = FoodCard
