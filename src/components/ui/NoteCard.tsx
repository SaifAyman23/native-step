import type { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Avatar, type AvatarTone } from './Avatar'
import { Badge } from './Badge'
import { Glyph, useQootIcon } from './Icon'
import { ArrowUpRightIcon, LinkSimpleIcon } from './icons'

interface NoteCardProps {
  /** Recipient's first name. Used when this is a sent note. */
  to?: string
  /** Sender's name. Used when this is a note the client received. */
  from?: string
  /** Full name used for the avatar initials. Defaults to `from` or `to`. */
  name?: string
  tone?: AvatarTone
  /** Sent or received time, e.g. `Today, 17:05`. */
  time: string
  body: string
  /** What the note is about, e.g. `Lunch, 13 Oct`. */
  context?: string
  /** Glyph before the context line. Defaults to the link glyph. */
  contextIcon?: ReactElement
  /** Makes the context line a link to the thing the note is about. */
  contextOnPress?: () => void
  /** Brand `New` badge for a note received today. */
  new?: boolean
  /** Full body and roomier padding, for the note's own screen. */
  big?: boolean
  onPress?: () => void
  className?: string
}

/** A one-way note the coach sent. No read state, no thread, no reply. */
export function NoteCard({
  to,
  from,
  name,
  tone = 'orange',
  time,
  body,
  context,
  contextIcon,
  contextOnPress,
  new: isNew = false,
  big = false,
  onPress,
  className,
}: NoteCardProps) {
  const contextGlyph = useQootIcon('text-2', 14, 'bold')
  const title = from ?? (to ? `To ${to}` : '')

  const contextShape = cn(
    'h-7 flex-row items-center gap-[6px] self-start rounded-full border border-border bg-surface-2 px-s3',
    contextOnPress && 'active:opacity-80'
  )

  const contextLine = context ? (
    contextOnPress ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`About ${context}`}
        onPress={contextOnPress}
        className={contextShape}
      >
        <Glyph icon={contextIcon ?? <LinkSimpleIcon />} {...contextGlyph} />
        <Text className="text-xs font-rubik-semibold text-text-2">{`About ${context}`}</Text>
        <Glyph icon={<ArrowUpRightIcon />} {...contextGlyph} />
      </Pressable>
    ) : (
      <View className={contextShape}>
        <Glyph icon={contextIcon ?? <LinkSimpleIcon />} {...contextGlyph} />
        <Text className="text-xs font-rubik-semibold text-text-2">{`About ${context}`}</Text>
      </View>
    )
  ) : null

  const content: ReactElement = (
    <>
      <View className="flex-row items-center gap-s3">
        <Avatar name={name ?? from ?? to ?? ''} tone={tone} />
        <View className="min-w-0 flex-1">
          <Text className="text-label text-text" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-caption text-text-2">{time}</Text>
        </View>
        {isNew ? <Badge label="New" tone="brand" /> : null}
      </View>

      <View className='px-s2'>
        <Text className="text-caption text-text m-2" numberOfLines={big ? undefined : 3}>
          {body}
        </Text>
      </View>

      {contextLine}
    </>
  )

  const shape = cn(
    'w-full border border-border bg-surface',
    big ? 'gap-s4 rounded-2xl p-s6' : 'gap-s3 rounded-xl p-s4',
    className
  )

  if (!onPress) return <View className={shape}>{content}</View>

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Note ${from ? `from ${from}` : `to ${to}`}, ${time}: ${body}`}
      onPress={onPress}
      style={({ pressed }) => (pressed ? { transform: [{ scale: 0.99 }] } : undefined)}
      className={shape}
    >
      {content}
    </Pressable>
  )
}
