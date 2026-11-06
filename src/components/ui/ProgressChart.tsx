import { useMemo } from 'react'
import { View } from 'react-native'
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg'

import { cn } from '@/lib/utils'
import { useThemeColors } from '@/theme'
import tokens from '@/theme/tokens'

import { Badge } from './Badge'
import { Txt as Text } from './Txt'

export interface ChartPoint {
  label: string
  value: number
}

interface ProgressChartProps {
  title?: string
  data: readonly ChartPoint[]
  /** Dashed goal line. Omit for no line. */
  goal?: number
  unit?: string
  /** Renders in the top right, e.g. `Down 1.2 kg`. */
  badge?: { label: string; tone: 'success' | 'warning' | 'error' }
  /** One honest number under the chart. */
  footnote?: string
  /**
   * Drops the card chrome and the first/last value labels, and shows the axis
   * bounds instead. Use when the chart is already titled by its own section.
   */
  bare?: boolean
  height?: number
  className?: string
}

const VIEW_W = 320
const VIEW_H = 140
const PAD_TOP = 14
const PAD_BOTTOM = 22

/**
 * A line with a filled area, three gridlines and an optional dashed goal. Real
 * values only, never a decorative sparkline.
 */
export function ProgressChart({
  title,
  data,
  goal,
  unit = 'kg',
  badge,
  footnote,
  bare = false,
  height = 180,
  className,
}: ProgressChartProps) {
  const colors = useThemeColors()

  const geometry = useMemo(() => {
    const values = data.map((point) => point.value)
    const min = Math.min(...values, goal ?? Infinity)
    const max = Math.max(...values, goal ?? -Infinity)
    const span = max - min || 1
    const low = min - span * 0.12
    const high = max + span * 0.12

    const x = (index: number) =>
      data.length <= 1 ? VIEW_W / 2 : (index / (data.length - 1)) * VIEW_W
    const y = (value: number) =>
      PAD_TOP + ((high - value) / (high - low)) * (VIEW_H - PAD_TOP - PAD_BOTTOM)

    const points = data.map((point, index) => ({ x: x(index), y: y(point.value) }))
    const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
    const area = `${line} L${VIEW_W} ${VIEW_H - PAD_BOTTOM} L0 ${VIEW_H - PAD_BOTTOM} Z`
    const last = points[points.length - 1]
    const first = points[0]

    return {
      points,
      line,
      area,
      last,
      first,
      low,
      high,
      gridlines: [0.25, 0.55, 0.85].map((fraction) => PAD_TOP + fraction * (VIEW_H - PAD_TOP - PAD_BOTTOM)),
      goalY: goal != null ? y(goal) : null,
    }
  }, [data, goal])

  const axisLabel = (value: number) => `${Math.round(value * 10) / 10}`

  return (
    <View
      className={cn(
        bare ? 'w-full' : 'w-full gap-s3 rounded-xl border border-border bg-surface p-s6',
        className
      )}
    >
      {bare ? null : (
        <View className="flex-row items-center justify-between gap-s3">
          <Text className="text-title font-rubik-semibold text-text">{title}</Text>
          {badge ? <Badge label={badge.label} tone={badge.tone} /> : null}
        </View>
      )}

      <Svg width="100%" height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
        {geometry.gridlines.map((lineY) => (
          <Line
            key={lineY}
            x1={0}
            y1={lineY}
            x2={VIEW_W}
            y2={lineY}
            stroke={colors.border}
            strokeWidth={1}
          />
        ))}

        {geometry.goalY != null ? (
          <Line
            x1={0}
            y1={geometry.goalY}
            x2={VIEW_W}
            y2={geometry.goalY}
            stroke={colors.primary}
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        ) : null}

        <Path d={geometry.area} fill={colors['primary-tint']} />
        <Path
          d={geometry.line}
          fill="none"
          stroke={colors.primary}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {geometry.last ? (
          <Circle cx={geometry.last.x} cy={geometry.last.y} r={5} fill={colors.primary} />
        ) : null}

        {geometry.first && !bare ? (
          <SvgText x={0} y={Math.max(10, geometry.first.y - 8)} fontSize={tokens.typography.xs.fontSize} fontFamily={tokens.fontFamily.medium} fill={colors['text-2']}>
            {`${data[0].value} ${unit}`}
          </SvgText>
        ) : null}
        {geometry.last && data.length > 1 && !bare ? (
          <SvgText
            x={Math.max(0, geometry.last.x - 52)}
            y={Math.max(10, geometry.last.y - 8)}
            fontSize={tokens.typography.xs.fontSize}
            fontFamily={tokens.fontFamily.medium}
            fill={colors['text-2']}
          >
            {`${data[data.length - 1].value} ${unit}`}
          </SvgText>
        ) : null}
        {bare ? (
          <>
            <SvgText x={0} y={10} fontSize={11} fontFamily={tokens.fontFamily.medium} fill={colors['text-2']}>
              {axisLabel(geometry.high)}
            </SvgText>
            <SvgText
              x={0}
              y={VIEW_H - 4}
              fontSize={11}
              fontFamily={tokens.fontFamily.medium}
              fill={colors['text-2']}
            >
              {axisLabel(geometry.low)}
            </SvgText>
          </>
        ) : null}
        {geometry.goalY != null ? (
          <SvgText x={4} y={Math.min(VIEW_H - 4, geometry.goalY - 6)} fontSize={11} fontFamily={tokens.fontFamily.medium} fill={colors['text-2']}>
            {`Goal ${goal} ${unit}`}
          </SvgText>
        ) : null}
      </Svg>

      {footnote ? <Text className="text-caption text-text-2">{footnote}</Text> : null}
    </View>
  )
}
