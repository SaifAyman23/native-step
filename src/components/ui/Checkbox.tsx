import { View } from 'react-native'
import { Txt as Text } from './Txt'

import { cn } from '@/lib/utils'

import { Check } from './Check'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

/** Checkbox with an optional trailing label. */
export function Checkbox({ checked, onChange, label, disabled, className }: CheckboxProps) {
  return (
    <View className={cn('flex-row items-center gap-s3', disabled && 'opacity-50', className)}>
      <Check
        checked={checked}
        onChange={onChange}
        accessibilityLabel={label ?? 'Checkbox'}
        disabled={disabled}
      />
      {label ? <Text className="flex-1 text-sm text-text">{label}</Text> : null}
    </View>
  )
}
