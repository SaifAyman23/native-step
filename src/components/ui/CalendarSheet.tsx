import { useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { Button } from './Button'
import { IconButton } from './IconButton'
import { CaretLeftIcon, CaretRightIcon } from './icons'
import { SheetSurface } from './Sheet'
import { Txt as Text } from './Txt'

function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function parseISODate(value: string): Date {
  return new Date(`${value}T12:00:00`)
}

interface CalendarSheetProps {
  /** The date the sheet opens on, `YYYY-MM-DD`. */
  value: string
  /** Called with the picked date. Only a tapped day reaches it. */
  onChange: (date: string) => void
  /** The last day that can be picked. Defaults to today. */
  maxDate?: string
  /** Called when the sheet is closed without a pick. */
  onClosed: () => void
}

/**
 * A month grid inside the app's own sheet.
 *
 * Moving between months only moves the view. A date is applied when a day is
 * tapped, and the sheet closes straight after, so a month is never changed by
 * accident.
 */
export function CalendarSheet({
  value,
  onChange,
  maxDate,
  onClosed,
}: CalendarSheetProps) {
  const { t } = useTranslation()
  const months = t('date.months', { returnObjects: true }) as string[]
  const weekdays = t('date.weekdays', { returnObjects: true }) as string[]

  const today = toISODate(new Date())
  const ceiling = maxDate ?? today
  const current = parseISODate(value)

  const [view, setView] = useState({ year: current.getFullYear(), month: current.getMonth() })

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1)
    // Saturday-first, the way the week strip runs.
    const offset = (first.getDay() + 1) % 7
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const out: (string | null)[] = Array.from({ length: offset }, () => null)
    for (let day = 1; day <= daysInMonth; day += 1) {
      out.push(toISODate(new Date(view.year, view.month, day)))
    }
    while (out.length % 7 !== 0) out.push(null)
    return out
  }, [view])

  const stepMonth = (offset: number) => {
    setView((current) => {
      const next = new Date(current.year, current.month + offset, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const atCeiling =
    view.year > new Date(`${ceiling}T12:00:00`).getFullYear() ||
    (view.year === new Date(`${ceiling}T12:00:00`).getFullYear() &&
      view.month > new Date(`${ceiling}T12:00:00`).getMonth())

  return (
    <SheetSurface
      onClosed={onClosed}
      title={t('common.pickDate')}
      footer={
        <Button
          title={t('common.today')}
          variant="secondary"
          block
          onPress={() => {
            onChange(today)
            onClosed()
          }}
        />
      }
    >
      <View className="gap-s4">
        <View className="flex-row items-center justify-between gap-s3">
          <IconButton
            icon={<CaretLeftIcon />}
            accessibilityLabel={t('common.previousMonth')}
            variant="ghost"
            onPress={() => stepMonth(-1)}
          />
          <Text className="text-title font-rubik-bold text-text">
            {`${months[view.month]} ${view.year}`}
          </Text>
          <IconButton
            icon={<CaretRightIcon />}
            accessibilityLabel={t('common.nextMonth')}
            variant="ghost"
            disabled={atCeiling}
            onPress={() => stepMonth(1)}
          />
        </View>

        <View className="flex-row gap-s1">
          {weekdays.map((day, index) => (
            <Text
              key={`${day}-${index}`}
              className="flex-1 text-center text-xs font-rubik-semibold text-text-3"
            >
              {day}
            </Text>
          ))}
        </View>

        <View className="gap-s1">
          {Array.from({ length: cells.length / 7 }, (_, row) => (
            <View key={row} className="flex-row gap-s1">
              {cells.slice(row * 7, row * 7 + 7).map((date, column) => {
                if (!date) {
                  return <View key={`${row}-${column}`} className="h-10 flex-1" />
                }
                const day = Number(date.slice(8, 10))
                const future = date > ceiling
                const selected = date === value
                const isToday = date === today

                return (
                  <Pressable
                    key={date}
                    accessibilityRole="button"
                    accessibilityLabel={`${day} ${months[view.month]}`}
                    accessibilityState={{ selected, disabled: future }}
                    disabled={future}
                    onPress={() => {
                      onChange(date)
                      onClosed()
                    }}
                    className={cn(
                      'h-10 flex-1 items-center justify-center rounded-md',
                      selected && 'bg-primary-tint',
                      future && 'opacity-30'
                    )}
                  >
                    <Text
                      className={cn(
                        'text-sm font-rubik-semibold',
                        selected ? 'text-primary-text' : isToday ? 'text-text' : 'text-text-2'
                      )}
                    >
                      {day}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          ))}
        </View>
      </View>
    </SheetSurface>
  )
}
