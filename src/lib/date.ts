import i18n from '@/i18n'

const MONTHS = i18n.t('date.months') as unknown as readonly string[]

function parts(value: string | Date) {
  if (value instanceof Date) {
    return {
      day: value.getDate(),
      month: value.getMonth(),
      year: value.getFullYear(),
    }
  }

  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return { day, month: month - 1, year }
}

export function toDateKey(date = new Date()) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function formatShortDate(value: string) {
  const date = parts(value)
  return `${date.day} ${MONTHS[date.month]}`
}

export function formatLongDate(value: string | Date) {
  const date = parts(value)
  return `${date.day} ${MONTHS[date.month]} ${date.year}`
}

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

/** True for a `YYYY-MM-DD` date key; anything else (e.g. old free text) is not a date. */
export function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && DATE_KEY.test(value)
}

/** Midday local time for a date key, so a DST change cannot move the day. */
export function parseDateKey(value: string) {
  return new Date(`${value}T12:00:00`)
}

/** Add (or subtract) `days` from a date key and return a new date key. */
export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}
