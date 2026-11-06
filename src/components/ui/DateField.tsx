import { useState } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'

import { formatLongDate, parseDateKey, toDateKey } from '@/lib/date'
import { cn } from '@/lib/utils'
import { useResolvedScheme } from '@/store/theme/themeStore'
import { useThemeColors } from '@/theme'

import { Button } from './Button'
import { CalendarBlankIcon, XIcon } from './icons'
import { SheetSurface } from './Sheet'
import { useSheet } from './SheetHost'
import { Txt as Text } from './Txt'

interface DateFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minimumDate?: Date | string
  maximumDate?: Date | string
  clearable?: boolean
  help?: string
  error?: string
  disabled?: boolean
  className?: string
}

function toDateParam(value?: Date | string) {
  if (!value) return undefined
  if (value instanceof Date) return value
  return parseDateKey(value)
}

interface DateSheetProps {
  initial: Date
  minimumDate?: Date
  maximumDate?: Date
  onDone: (date: Date) => void
  onClosed: () => void
}

function DateSheet({ initial, minimumDate, maximumDate, onDone, onClosed }: DateSheetProps) {
  const { t } = useTranslation()
  const scheme = useResolvedScheme()
  const colors = useThemeColors()
  const [draft, setDraft] = useState(initial)

  return (
    <SheetSurface
      title={t('common.pickDate')}
      onClosed={onClosed}
      footer={
        <Button title={t('common.done')} block onPress={() => onDone(draft)} />
      }
    >
      <DateTimePicker
        value={draft}
        mode="date"
        display="inline"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        themeVariant={scheme}
        accentColor={colors.primary}
        onChange={(_event, date) => {
          if (date) setDraft(date)
        }}
      />
    </SheetSurface>
  )
}

export function DateField({
  label,
  value,
  onChange,
  placeholder,
  minimumDate,
  maximumDate,
  clearable = false,
  help,
  error,
  disabled = false,
  className,
}: DateFieldProps) {
  const { t } = useTranslation()
  const host = useSheet()
  const colors = useThemeColors()
  const [showAndroid, setShowAndroid] = useState(false)

  const minDate = toDateParam(minimumDate)
  const maxDate = toDateParam(maximumDate)
  const baseDate = value ? parseDateKey(value) : (minDate ?? new Date())

  const open = () => {
    if (disabled) return
    if (Platform.OS === 'android') {
      setShowAndroid(true)
      return
    }
    host.present(
      <DateSheet
        initial={baseDate}
        minimumDate={minDate}
        maximumDate={maxDate}
        onDone={(date) => {
          onChange(toDateKey(date))
          host.dismissAll()
        }}
        onClosed={host.dismiss}
      />
    )
  }

  return (
    <View className={cn('w-full gap-s2', className)}>
      {label ? <Text className="text-label font-rubik-bold mb-3 text-text">{label}</Text> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityValue={{ text: value ? formatLongDate(value) : placeholder }}
        disabled={disabled}
        onPress={open}
        className={cn(
          'h-[56px] w-full flex-row items-center justify-between gap-s3 rounded-lg border-2 px-s7',
          disabled ? 'border-transparent bg-surface-3' : 'border-border-strong bg-surface'
        )}
      >
        <Text
          className={cn(
            'flex-1 text-base font-rubik-medium',
            disabled ? 'text-text-3' : value ? 'text-text' : 'text-text-3'
          )}
          numberOfLines={1}
        >
          {value ? formatLongDate(value) : (placeholder ?? '')}
        </Text>
        {clearable && value && !disabled ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.clearDate')}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation()
              onChange('')
            }}
            className="items-center justify-center"
          >
            <XIcon color={colors['text-3']} size={18} weight="bold" />
          </Pressable>
        ) : null}
        <CalendarBlankIcon color={colors['text-3']} size={20} weight="bold" />
      </Pressable>

      {error ? (
        <Text className="text-sm mt-1 text-error-text">{error}</Text>
      ) : help ? (
        <Text className="text-sm mt-1 text-text-2">{help}</Text>
      ) : null}

      {Platform.OS === 'android' && showAndroid ? (
        <DateTimePicker
          value={baseDate}
          mode="date"
          display="default"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setShowAndroid(false)
            if (event.type === 'set' && date) onChange(toDateKey(date))
          }}
        />
      ) : null}
    </View>
  )
}
