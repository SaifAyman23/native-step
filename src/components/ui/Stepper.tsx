import { useState } from 'react'
import { TextInput, View } from 'react-native'

import { cn } from '@/lib/utils'

import { IconButton } from './IconButton'
import { MinusIcon, PlusIcon } from './icons'
import { Txt as Text } from './Txt'

interface StepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  className?: string
}

/** Quantity stepper: two 48dp buttons around an editable number and its unit. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  unit,
  className,
}: StepperProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const allowDecimal = !Number.isInteger(step) || !Number.isInteger(min) || !Number.isInteger(max)
  const decimals = Math.min(4, String(step).split('.')[1]?.length ?? 0)

  const format = (next: number) => String(Number(next.toFixed(decimals)))
  const shown = draft ?? format(value)

  const bound = (next: number) => Math.min(max, Math.max(min, Number(next.toFixed(decimals))))

  const decrease = () => {
    setDraft(null)
    onChange(bound(value - step))
  }
  const increase = () => {
    setDraft(null)
    onChange(bound(value + step))
  }

  const typed = (text: string) => {
    const normalized = text.replace(',', '.')
    const cleaned = allowDecimal
      ? normalized.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
      : normalized.replace(/[^0-9]/g, '')
    setDraft(cleaned)
    const next = Number.parseFloat(cleaned)
    if (!Number.isNaN(next)) onChange(bound(next))
  }

  const commit = () => {
    const parsed = Number.parseFloat(shown.replace(',', '.'))
    if (Number.isNaN(parsed)) {
      setDraft(null)
      return
    }
    const bounded = Math.min(max, Math.max(min, parsed))
    const snapped = Math.round((bounded - min) / step) * step + min
    onChange(bound(snapped))
    setDraft(null)
  }

  return (
    <View className={cn('w-full flex-row items-center gap-s3', className)}>
      <IconButton
        icon={<MinusIcon />}
        accessibilityLabel="Less"
        onPress={decrease}
        disabled={value <= min}
      />

      <View
        className="flex-1 items-center justify-center"
        accessibilityRole="adjustable"
        accessibilityLabel="Quantity"
        accessibilityValue={{
          min,
          max,
          now: value,
          text: unit ? `${value} ${unit}` : String(value),
        }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') increase()
          if (event.nativeEvent.actionName === 'decrement') decrease()
        }}
      >
        <View className="flex-row items-baseline justify-center gap-s2">
          <TextInput
            value={shown}
            onChangeText={typed}
            onBlur={commit}
            onSubmitEditing={commit}
            keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
            inputMode={allowDecimal ? 'decimal' : 'numeric'}
            returnKeyType="done"
            selectTextOnFocus
            accessibilityLabel="Quantity value"
            className="w-20 p-0 text-center text-metricMd text-text"
            style={{ fontVariant: ['tabular-nums'] }}
          />
          {unit ? <Text className="text-caption text-text-2">{unit}</Text> : null}
        </View>
      </View>

      <IconButton
        icon={<PlusIcon />}
        accessibilityLabel="More"
        onPress={increase}
        disabled={value >= max}
      />
    </View>
  )
}
