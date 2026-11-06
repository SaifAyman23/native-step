import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/lib/utils'

export type SkeletonVariant = 'line' | 'thick' | 'block' | 'circle'

interface SkeletonProps {
  /** Shapes the placeholder to the content it replaces. */
  variant?: SkeletonVariant
  width?: number | `${number}%`
  height?: number
  className?: string
}

const box: Record<SkeletonVariant, { base: string; width: number; height: number }> = {
  line: { base: 'rounded-md', width: 200, height: 12 },
  thick: { base: 'rounded-lg', width: 200, height: 20 },
  block: { base: 'rounded-xl', width: 280, height: 140 },
  circle: { base: 'rounded-full', width: 44, height: 44 },
}

/** Shimmer placeholder. Never a bare spinner. */
export function Skeleton({ variant = 'line', width, height, className }: SkeletonProps) {
  const reduced = useReducedMotion()
  const opacity = useSharedValue(0.55)
  const spec = box[variant]

  useEffect(() => {
    if (reduced) {
      opacity.set(0.65)
      return
    }
    opacity.set(withRepeat(withTiming(1, { duration: 900 }), -1, true))
  }, [opacity, reduced])

  const style = useAnimatedStyle(() => ({ opacity: opacity.get() }))

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[
        style,
        { width: width ?? spec.width, height: height ?? spec.height },
      ]}
      className={cn('bg-track', spec.base, className)}
    />
  )
}

export type ScreenSkeletonVariant = 'dashboard' | 'list' | 'profile' | 'grid'

function SkeletonRow() {
  return (
    <View className="flex-row items-center gap-s4 rounded-xl border border-border bg-surface p-s4">
      <Skeleton variant="circle" />
      <View className="flex-1 gap-s2">
        <Skeleton variant="line" width="62%" />
        <Skeleton variant="line" width="40%" />
      </View>
    </View>
  )
}

/** Shape-matched page placeholder. Keeps the chrome and replaces only the body. */
export function ScreenSkeleton({
  variant = 'dashboard',
  className,
}: {
  variant?: ScreenSkeletonVariant
  className?: string
}) {
  if (variant === 'list') {
    return (
      <View className={cn('gap-s3', className)}>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </View>
    )
  }

  if (variant === 'profile') {
    return (
      <View className={cn('items-center gap-s4', className)}>
        <Skeleton variant="circle" width={84} height={84} />
        <Skeleton variant="thick" width="52%" />
        <Skeleton variant="line" width="72%" />
        <View className="mt-s3 w-full gap-s3">
          <Skeleton variant="block" width="100%" height={72} />
          <Skeleton variant="block" width="100%" height={72} />
          <Skeleton variant="block" width="100%" height={72} />
        </View>
      </View>
    )
  }

  if (variant === 'grid') {
    return (
      <View className={cn('gap-s4', className)}>
        <Skeleton variant="block" width="100%" height={120} />
        <View className="flex-row gap-s4">
          <Skeleton variant="block" width="47%" height={150} />
          <Skeleton variant="block" width="47%" height={150} />
        </View>
        <View className="flex-row gap-s4">
          <Skeleton variant="block" width="47%" height={150} />
          <Skeleton variant="block" width="47%" height={150} />
        </View>
      </View>
    )
  }

  return (
    <View className={cn('gap-s4', className)}>
      <Skeleton variant="block" width="100%" height={148} />
      <View className="flex-row gap-s3">
        <Skeleton variant="thick" width="32%" height={68} />
        <Skeleton variant="thick" width="32%" height={68} />
        <Skeleton variant="thick" width="32%" height={68} />
      </View>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  )
}
