import * as Clipboard from 'expo-clipboard'
import { useCallback } from 'react'
import { View } from 'react-native'

import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { Button } from './Button'
import { CopyIcon } from './icons'
import { Txt as Text } from './Txt'

interface ShareCodeProps {
  code: string
  caption?: string
  /** Fired after the code is on the clipboard, e.g. to show the screen's toast. */
  onCopied?: () => void
  className?: string
}

/** The 8 character code a client hands to a coach, with one copy action. */
export function ShareCode({
  code,
  caption,
  onCopied,
  className,
}: ShareCodeProps) {
  const [t] = useTranslation()
  const copy = useCallback(async () => {
    await Clipboard.setStringAsync(code)
    onCopied?.()
  }, [code, onCopied])

  return (
    <View
      className={cn(
        'items-center gap-s3 rounded-2xl border border-dashed border-border-strong bg-surface px-s5 py-s6',
        className
      )}
    >
      <Text className="text-caption text-text-2">{caption ?? t('shareCode.caption')}</Text>
      <Text className="text-4xl font-rubik-extrabold leading-[38px] tracking-[0.14em] text-text">
        {code}
      </Text>
      <Button
        title={t('shareCode.copy')}
        variant="secondary"
        icon={<CopyIcon />}
        block
        accessibilityLabel={t('shareCode.accessibilityLabel', { code })}
        onPress={copy}
      />
    </View>
  )
}
