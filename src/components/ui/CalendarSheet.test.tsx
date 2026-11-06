import { fireEvent, render, screen } from '@testing-library/react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { I18nextProvider } from 'react-i18next'

import i18n from '@/i18n'
import { DateNav } from '@/components/ui/AppBar'
import { CalendarSheet } from '@/components/ui/CalendarSheet'
import { SheetHost } from '@/components/ui/SheetHost'

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
}

const MONTHS = i18n.t('date.months', { returnObjects: true }) as string[]

const now = new Date()
const THIS_MONTH = MONTHS[now.getMonth()]
const PREVIOUS_MONTH = MONTHS[now.getMonth() === 0 ? 11 : now.getMonth() - 1]
const TODAY = (() => {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
})()

const LABEL = `Day ${now.getDate()} ${MONTHS[now.getMonth()]}`

function renderWithHost(node: React.ReactNode) {
  return render(
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={METRICS}>
        <I18nextProvider i18n={i18n}>
          <SheetHost>{node}</SheetHost>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

describe('CalendarSheet', () => {
  it('does not apply a date when the month changes', async () => {
    const onChange = jest.fn()

    await renderWithHost(
      <CalendarSheet value={TODAY} onChange={onChange} onClosed={() => {}} />
    )

    await fireEvent.press(screen.getByLabelText('Previous month'))
    await fireEvent.press(screen.getByLabelText('Next month'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies the date only when a day is tapped', async () => {
    const onChange = jest.fn()

    await renderWithHost(
      <CalendarSheet value={TODAY} onChange={onChange} onClosed={() => {}} />
    )

    // Move to the previous month, which must not apply anything on its own.
    await fireEvent.press(screen.getByLabelText('Previous month'))
    expect(onChange).not.toHaveBeenCalled()

    await fireEvent.press(screen.getByLabelText(`15 ${PREVIOUS_MONTH}`))

    expect(onChange).toHaveBeenCalledTimes(1)
    const picked = onChange.mock.calls[0][0] as string
    expect(picked).toMatch(/^\d{4}-\d{2}-15$/)
    expect(picked.endsWith('-15')).toBe(true)
  })

  it('will not let a future day be picked', async () => {
    const onChange = jest.fn()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const label = `${tomorrow.getDate()} ${MONTHS[tomorrow.getMonth()]}`

    await renderWithHost(
      <CalendarSheet value={TODAY} onChange={onChange} onClosed={() => {}} />
    )

    // On the last day of a month tomorrow falls in the next one, so it is not on
    // this grid at all and cannot be picked from here.
    const onThisGrid = tomorrow.getMonth() === now.getMonth()
    if (!onThisGrid) {
      expect(screen.queryByLabelText(label)).toBeNull()
      return
    }

    await fireEvent.press(screen.getByLabelText(label))

    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('DateNav with a calendar', () => {
  it('opens the calendar, closes it, and unmounts it', async () => {
    await renderWithHost(
      <DateNav
        label={LABEL}
        calendar={{ value: TODAY, onChange: () => {}, maxDate: TODAY }}
      />
    )

    // Closed to begin with.
    expect(screen.queryByLabelText('Previous month')).toBeNull()

    await fireEvent.press(screen.getByLabelText(`Date: ${LABEL}`))
    expect(await screen.findByLabelText('Previous month')).toBeTruthy()

    // Today closes it and applies.
    await fireEvent.press(screen.getByText('Today'))
    await screen.findByLabelText(`Date: ${LABEL}`)
    expect(screen.queryByLabelText('Previous month')).toBeNull()
  })

  it('opens a fresh calendar every time, with no state carried over', async () => {
    await renderWithHost(
      <DateNav
        label={LABEL}
        calendar={{ value: TODAY, onChange: () => {}, maxDate: TODAY }}
      />
    )

    await fireEvent.press(screen.getByLabelText(`Date: ${LABEL}`))
    await screen.findByLabelText('Previous month')
    await fireEvent.press(screen.getByLabelText('Previous month'))
    expect(await screen.findByText(new RegExp(PREVIOUS_MONTH + ' \\d{4}'))).toBeTruthy()

    // Close, then reopen. The view must be back on the current month.
    await fireEvent.press(screen.getByText('Today'))
    await screen.findByLabelText(`Date: ${LABEL}`)

    await fireEvent.press(screen.getByLabelText(`Date: ${LABEL}`))
    expect(await screen.findByText(new RegExp(THIS_MONTH + ' \\d{4}'))).toBeTruthy()
  })
})
