import { Image } from 'expo-image'
import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'
import { FireIcon } from './icons'

export type AvatarTone = 'orange' | 'green' | 'yellow' | 'sky' | 'berry'
export type AvatarStatus = 'ok' | 'warn'
export type AvatarSize = 'md' | 'lg' | 'xl' | '2xl'

const toneBox: Record<AvatarTone, string> = {
  orange: 'bg-tint-orange',
  green: 'bg-tint-green',
  yellow: 'bg-tint-yellow',
  sky: 'bg-tint-sky',
  berry: 'bg-tint-berry',
}

const statusBox: Record<AvatarStatus, string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
}

const SIZES: Record<
  AvatarSize,
  { box: string; text: string; line: number; dot: string; dotBorder: string; dotOffset: string }
> = {
  md: {
    box: 'h-11 w-11',
    text: 'text-sm',
    line: 22,
    dot: 'h-[15px] w-[15px]',
    dotBorder: 'border-[2.5px]',
    dotOffset: '-bottom-[2px] -right-[2px]',
  },
  lg: {
    box: 'h-16 w-16',
    text: 'text-xl',
    line: 30,
    dot: 'h-[18px] w-[18px]',
    dotBorder: 'border-[3px]',
    dotOffset: '-bottom-[3px] -right-[3px]',
  },
  xl: {
    box: 'h-24 w-24',
    text: 'text-3xl',
    line: 42,
    dot: 'h-[22px] w-[22px]',
    dotBorder: 'border-[3.5px]',
    dotOffset: '-bottom-[4px] -right-[4px]',
  },
  '2xl': {
    box: 'h-32 w-32',
    text: 'text-4xl',
    line: 56,
    dot: 'h-[26px] w-[26px]',
    dotBorder: 'border-4',
    dotOffset: '-bottom-[5px] -right-[5px]',
  },
}

interface AvatarProps {
  /** One or two initials. Never a real photo unless a licensed one is supplied. */
  name: string
  size?: AvatarSize
  tone?: AvatarTone
  /** Status dot on the avatar. The worded badge beside it carries the meaning. */
  status?: AvatarStatus
  uri?: string
  className?: string
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

export function Avatar({ name, size = 'md', tone = 'yellow', status, uri, className }: AvatarProps) {
  const spec = SIZES[size]
  return (
    <View className={cn('relative', className)}>
      <View
        accessibilityLabel={name}
        className={cn('items-center justify-center overflow-hidden rounded-full', toneBox[tone], spec.box)}
      >
        {uri ? (
          <Image
            source={{ uri }}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessibilityLabel={name}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Text
            className={cn('font-rubik-bold text-text', spec.text)}
            style={{ lineHeight: spec.line }}
          >
            {initials(name)}
          </Text>
        )}
      </View>
      {status ? (
        <View
          accessibilityLabel={status === 'ok' ? 'On track' : 'Needs attention'}
          className={cn(
            'absolute rounded-full border-surface',
            spec.dotOffset,
            spec.dot,
            spec.dotBorder,
            statusBox[status]
          )}
        />
      ) : null}
    </View>
  )
}

interface StreakDotProps {
  days: number
  short?: boolean
  className?: string
}

/** Streak counter used inside an app bar or a nav bar. */
export function StreakDot({ days, short = false, className }: StreakDotProps) {
  const glyph = useQootIcon('tint-orange-t', 13, 'bold')
  return (
    <View
      accessibilityLabel={`${days} day streak`}
      className={cn(
        'h-[26px] flex-row items-center gap-s2 self-start rounded-full bg-tint-orange px-[10px]',
        className
      )}
    >
      <Glyph icon={<FireIcon />} {...glyph} />
      <Text className="text-label text-tint-orange-t" numeric>
        {short ? days : `${days} days`}
      </Text>
    </View>
  )
}
