import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

interface FieldProps {
  label?: string
  /** Help text under the control. */
  help?: string
  /** Error text replaces help and turns the control invalid. */
  error?: string
  /** Removes the 12px gap so the label can sit flush against a dark header. */
  tight?: boolean
  className?: string
  children: ReactNode
}

/**
 * Label above, help below, error below that. Never a placeholder as a label.
 */
export function Field({ label, help, error, tight = false, className, children }: FieldProps) {
  return (
    <View className={cn('w-full gap-s2', className)}>
      {label ? (
        <Text className={cn('text-label text-text', tight && '-mb-s2')}>
          {label}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text className="text-caption text-error-text">{error}</Text>
      ) : help ? (
        <Text className="text-caption text-text-2">{help}</Text>
      ) : null}
    </View>
  )
}
