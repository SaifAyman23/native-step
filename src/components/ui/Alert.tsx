import type { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { Glyph, useQootIcon } from './Icon'
import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CloudSlashIcon,
  DropIcon,
  InfoIcon,
  LightbulbIcon,
  WarningIcon,
  XCircleIcon,
} from './icons'

export type AlertTone = 'ok' | 'warn' | 'info' | 'error'

const alertTone: Record<AlertTone, { box: string; text: string }> = {
  ok: { box: 'bg-success-bg', text: 'text-success-text' },
  warn: { box: 'bg-warning-bg', text: 'text-warning-text' },
  info: { box: 'bg-info-bg', text: 'text-info-text' },
  error: { box: 'bg-error-bg', text: 'text-error-text' },
}

const alertIcon: Record<AlertTone, ReactElement> = {
  ok: <CheckCircleIcon />,
  warn: <WarningIcon />,
  info: <InfoIcon />,
  error: <XCircleIcon />,
}

interface AlertProps {
  tone?: AlertTone
  title?: string
  body?: string
  className?: string
}

export function Alert({ tone = 'info', title, body, className }: AlertProps) {
  const spec = alertTone[tone]
  const glyph = useQootIcon(
    tone === 'ok' ? 'success-text' : tone === 'warn' ? 'warning-text' : tone === 'error' ? 'error-text' : 'info-text',
    18,
    'bold'
  )
  return (
    <View
      accessibilityRole="alert"
      className={cn('flex-row items-start gap-s5 rounded-lg px-s5 py-s4', spec.box, className)}
    >
      <Glyph className='mt-1' icon={alertIcon[tone]} {...glyph} style={{ marginTop: 1 }} />
      <View className="flex-1">
        {title ? (
          <Text className={cn('text-body mb-2 font-rubik-medium', spec.text)}>{title}</Text>
        ) : null}
        {body ? <Text className={cn('text-caption', spec.text)}>{body}</Text> : null}
      </View>
    </View>
  )
}

interface NudgeProps {
  title: string
  body?: string
  icon?: ReactElement
  onPress?: () => void
  actionLabel?: string
  className?: string
}

/** One nudge per screen. It says what to do next, not what happened. */
export function Nudge({ title, body, icon, onPress, actionLabel, className }: NudgeProps) {
  const glyph = useQootIcon('tint-yellow-t', 24, 'bold')
  const content = (
    <>
      <Glyph icon={icon ?? <LightbulbIcon />} {...glyph} />
      <View className="flex-1">
        <Text className="text-title text-text">{title}</Text>
        {body ? <Text className="text-caption text-tint-yellow-t">{body}</Text> : null}
      </View>
      {actionLabel ? (
        <Text className="text-sm font-rubik-medium text-tint-yellow-t">{actionLabel}</Text>
      ) : null}
    </>
  )
  const shape = cn('flex-row items-center gap-s4 rounded-xl bg-tint-yellow px-s5 py-s4', className)
  if (!onPress) return <View className={shape}>{content}</View>
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className={cn(shape, 'active:opacity-80')}
    >
      {content}
    </Pressable>
  )
}

export type BannerTone = 'offline' | 'syncing'

interface BannerProps {
  tone?: BannerTone
  message: string
  /** Replaces the tone's glyph, e.g. a bell on a reminder banner. */
  icon?: ReactElement
  className?: string
}

/** Connectivity state. Offline and syncing are different words, never the same. */
export function Banner({ tone = 'offline', message, icon, className }: BannerProps) {
  const spec =
    tone === 'offline'
      ? { box: 'bg-warning-bg', text: 'text-warning-text', glyph: <CloudSlashIcon /> }
      : { box: 'bg-info-bg', text: 'text-info-text', glyph: <ArrowsClockwiseIcon /> }
  const glyph = useQootIcon(tone === 'offline' ? 'warning-text' : 'info-text', 16, 'bold')
  return (
    <View
      accessibilityRole="alert"
      className={cn('flex-row items-center gap-s3 rounded-md px-s5 py-s3', spec.box, className)}
    >
      <Glyph icon={icon ?? spec.glyph} {...glyph} />
      <Text className={cn('flex-1 text-sm font-rubik-semibold', spec.text)}>{message}</Text>
    </View>
  )
}

/** A nudge that points at progress specifically. */
export function WaterNudge({ filled, total, className }: { filled: number; total: number; className?: string }) {
  const [t] = useTranslation()
  return (
    <Nudge
      title={t('alert.waterNudge.title', { remaining: total - filled })}
      body={t('alert.waterNudge.body', { filled, total })}
      icon={<DropIcon />}
      className={className}
    />
  )
}
