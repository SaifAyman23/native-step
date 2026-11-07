import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, G } from 'react-native-svg'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'
import { useThemeColors, type ColorToken } from '@/theme'
import tokens from '@/theme/tokens'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export type RingSize = 'hero' | 'medium' | 'small'

interface SizeSpec {
  box: number
  stroke: number
  number: number
  unit: number
}

const SIZES: Record<RingSize, SizeSpec> = {
  hero: { box: 220, stroke: 18, number: 45, unit: 14 },
  medium: { box: 148, stroke: 14, number: 24, unit: 11 },
  small: { box: 124, stroke: 12, number: 20, unit: 10 },
}

/** The day splits into three even 120 degree sections, clockwise from twelve. */
interface QootRingProps {
  size?: RingSize
  box?: number
  stroke?: number
  /**
   * Centre text scale. Defaults to `size`, but the Today hero deliberately pairs a
   * 124 box with the medium centre, so the two are separate knobs.
   */
  center?: RingSize
  /** Percent of each segment target reached. */
  protein: number
  carbs: number
  fat: number
  /** Big number in the middle. */
  value?: string
  /** Muted line under the number. */
  caption?: string
  /** Replaces the caption when there is nothing else to say. */
  unit?: string
  className?: string
}

/**
 * Three loaders in one ring: a neutral track for the whole target and a coloured
 * fill for the part eaten, so the empty track is what is left. A 4px gap and
 * round caps separate the sections. One ring per screen, maximum.
 */
export function QootRing({
  size = 'medium',
  box,
  stroke,
  center,
  protein,
  carbs,
  fat,
  value,
  caption,
  unit,
  className,
}: QootRingProps) {
  const colors = useThemeColors()
  const spec = SIZES[size]
  const centreSize = center ?? size
  const centre = SIZES[centreSize]
  const diameter = box ?? spec.box
  const width = stroke ?? spec.stroke
  const text = spec.number

  const radius = (diameter - width) / 2
  const circumference = 2 * Math.PI * radius
  const section = circumference / 3
  // The gap scales with the stroke so a thick ring does not swallow its sections.
  const gap = 4 + width
  const half = gap / 2
  const draw = section - gap

  const sections: [string, ColorToken, number][] = [
    ['protein', 'protein', protein],
    ['carbs', 'carbs', carbs],
    ['fat', 'fat', fat],
  ]

  return (
    <View style={{ width: diameter, height: diameter }} className={cn('items-center justify-center', className)}>
      <Svg width={diameter} height={diameter} style={{ position: 'absolute' }}>
        <G rotation={-90} originX={diameter / 2} originY={diameter / 2}>
          {sections.map(([name, token, percent], index) => (
            <RingSection
              key={name}
              cx={diameter / 2}
              cy={diameter / 2}
              radius={radius}
              width={width}
              circumference={circumference}
              length={draw}
              start={section * index + half}
              trackColor={colors.track}
              fillColor={colors[token]}
              percent={Math.max(0, Math.min(100, percent))}
            />
          ))}
        </G>
      </Svg>

      <View className="items-center justify-center px-s7">
        {value ? (
          <Text
            // Sized from the ring spec, not the type ramp: the centre number has
            // to stay inside its own circle at any global type size.
            // Color comes from Txt's default (text-text) — adding "text-text text-title"
            // here collapses in twMerge (shared text-* group) and drops the color to black.
            style={{
              lineHeight: Math.round(centre.number * 1.06),
              fontSize: centre.number,
              fontFamily: tokens.fontFamily.bold,
            }}
            numeric
          >
            {value}
          </Text>
        ) : null}
        {caption ?? unit ? (
          <Text
            className={cn(
              'mt-[2px] text-center font-rubik-semibold',
              centreSize === 'hero' ? 'text-text' : 'text-text-2'
            )}
            style={{ fontSize: centre.unit, lineHeight: Math.round(centre.unit * 1.2) }}
          >
            {caption ?? unit}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

function RingSection({
  cx,
  cy,
  radius,
  width,
  circumference,
  length,
  start,
  trackColor,
  fillColor,
  percent,
}: {
  cx: number
  cy: number
  radius: number
  width: number
  circumference: number
  length: number
  start: number
  trackColor: string
  fillColor: string
  percent: number
}) {
  const reduced = useReducedMotion()
  const progress = useSharedValue(reduced ? percent : 0)

  useEffect(() => {
    progress.set(
      reduced ? percent : withTiming(percent, { duration: 700, easing: Easing.out(Easing.cubic) })
    )
  }, [percent, progress, reduced])

  // The dash length is what grows, and the offset stays put. Sliding the offset
  // instead would leave a full-length dash parked over the next section whenever
  // the fill is short, because the three sections share one circumference.
  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [Math.max(0.1, length * (progress.get() / 100)), circumference],
  }))

  return (
    <>
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={trackColor}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${length} ${circumference}`}
        strokeDashoffset={-start}
        fill="none"
      />
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={fillColor}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={[Math.max(0.1, length * (percent / 100)), circumference]}
        strokeDashoffset={-start}
        fill="none"
        animatedProps={animatedProps}
      />
    </>
  )
}

/** Generic alias. Three-segment ring for any progress. */
export const ProgressRing = QootRing
