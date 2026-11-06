import type { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Banner } from './Alert'
import { Button } from './Button'
import { Glyph, useQootIcon } from './Icon'
import { BowlFoodIcon, PlugsIcon } from './icons'
import { Skeleton } from './Skeleton'

export type StatusState = 'loading' | 'empty' | 'error' | 'ready'

const statusIcon: Record<Exclude<StatusState, 'loading' | 'ready'>, ReactElement> = {
  empty: <BowlFoodIcon />,
  error: <PlugsIcon />,
}

interface StatusViewProps {
  /**
   * Which of the four states the screen is in. `ready` renders `children`, so a
   * screen can put its content and its empty and error states in one place.
   */
  state: StatusState
  /** The screen's content. Rendered when `state` is `ready`. */
  children?: ReactNode
  /** Error state: the code to explain, and the action that fixes it. */
  errorCode?: string
  errorTitle?: string
  errorBody?: string
  onRetry?: () => void
  retryLabel?: string
  /** Empty state: what is missing, and the one action that fixes it. */
  emptyTitle?: string
  emptyBody?: string
  emptyActionLabel?: string
  onEmptyAction?: () => void
  /** Overrides the glyph for the empty and error states. */
  icon?: ReactElement
  /** Rendered under the content, e.g. an offline banner. */
  extra?: ReactElement
  className?: string
}

/**
 * One component renders every screen's four states. Loading is a skeleton
 * matching the screen's shape, never a bare spinner.
 */
export function StatusView({
  state,
  children,
  errorCode,
  errorTitle,
  errorBody,
  onRetry,
  retryLabel = 'retry',
  emptyTitle,
  emptyBody,
  emptyActionLabel,
  onEmptyAction,
  icon,
  extra,
  className,
}: StatusViewProps) {
  const [t] = useTranslation()
  const glyph = useQootIcon('text-2', 44, 'bold')

  if (state === 'ready') return <>{children}</>

  if (state === 'loading') {
    return (
      <View className={cn('w-full gap-s3', className)}>
        <Skeleton variant="thick" />
        <Skeleton variant="line" width="80%" />
        <Skeleton variant="line" width="60%" />
        <Skeleton variant="block" />
      </View>
    )
  }

  if (state === 'error') {
    const message = errorBody ?? (errorCode ? t(`statusView.errorMessages.${errorCode}`) : undefined)

    return (
      <View className={cn('w-full items-center gap-s4 px-s5 py-s9', className)}>
        <Glyph icon={icon ?? statusIcon.error} {...glyph} />
        <Text className="text-title font-rubik-semibold text-text">
          {errorTitle ?? t('statusView.defaultError')}
        </Text>
        {message ? (
          <Text className="max-w-[34ch] text-center text-body text-text-2">{message}</Text>
        ) : null}
        {onRetry ? <Button title={t(retryLabel)} onPress={onRetry} size="sm" /> : null}
        {extra}
      </View>
    )
  }

  return (
    <View className={cn('w-full items-center gap-s4 px-s5 py-s9', className)}>
      <Glyph icon={icon ?? statusIcon.empty} {...glyph} />
      {emptyTitle ? <Text className="text-title font-rubik-semibold text-text">{emptyTitle}</Text> : null}
      {emptyBody ? (
        <Text className="max-w-[34ch] text-center text-body text-text-2">{emptyBody}</Text>
      ) : null}
      {emptyActionLabel && onEmptyAction ? (
        <Button title={emptyActionLabel} onPress={onEmptyAction} size="sm" />
      ) : null}
      {extra}
    </View>
  )
}

/** Offline banner plus the row skeletons that match a list screen. */
export function OfflineSkeleton({
  message,
  className,
}: {
  message?: string
  className?: string
}) {
  const [t] = useTranslation()
  return (
    <View className={cn('w-full gap-s4', className)}>
      <Banner message={message ?? t('statusView.defaultOffline')} />
      <View className="flex-row items-center gap-s4">
        <Skeleton variant="circle" />
        <View className="flex-1 gap-s3">
          <Skeleton variant="line" width="70%" />
          <Skeleton variant="line" width="45%" />
        </View>
      </View>
    </View>
  )
}
