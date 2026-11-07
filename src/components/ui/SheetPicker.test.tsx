import { fireEvent, render, screen } from '@testing-library/react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { SheetPicker, SheetSurface, type SheetOption } from '@/components/ui/Sheet'
import { SheetHost } from '@/components/ui/SheetHost'

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
}

const OPTIONS: SheetOption[] = [
  { value: 'peanut', label: 'Peanut', sub: 'Peanuts and groundnuts' },
  { value: 'dairy', label: 'Dairy', sub: 'Milk, cheese, yoghurt' },
  { value: 'gluten', label: 'Gluten', sub: 'Wheat, barley, rye' },
]

const LONG_OPTIONS: SheetOption[] = Array.from({ length: 14 }, (_, index) => ({
  value: `option-${index}`,
  label: `Option ${index}`,
}))

function renderPicker(node: React.ReactNode) {
  return render(
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={METRICS}>
        <SheetHost>{node}</SheetHost>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

describe('SheetPicker', () => {
  it('reports a single choice', async () => {
    const onChange = jest.fn()

    await renderPicker(
      <SheetSurface onClosed={() => {}} title="Allergies">
        <SheetPicker value="" onChange={onChange} options={OPTIONS} />
      </SheetSurface>
    )

    await fireEvent.press(screen.getByText('Dairy'))
    expect(onChange).toHaveBeenCalledWith('dairy')
  })

  it('toggles a multi choice and confirms it', async () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()

    await renderPicker(
      <SheetSurface onClosed={() => {}} title="Allergies">
        <SheetPicker
          multiple
          value={['peanut']}
          onChange={onChange}
          onConfirm={onConfirm}
          options={OPTIONS}
        />
      </SheetSurface>
    )

    await fireEvent.press(screen.getByText('Dairy'))
    expect(onChange).toHaveBeenCalledWith(['peanut', 'dairy'])

    // The picker owns the draft internally, so the confirm button reflects
    // the live selection instead of the frozen `value` prop.
    await fireEvent.press(screen.getByText('Confirm 2 selected'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('shows a search field once the list is long, and filters by it', async () => {
    await renderPicker(
      <SheetSurface onClosed={() => {}} title="Choose">
        <SheetPicker value="" onChange={() => {}} options={LONG_OPTIONS} />
      </SheetSurface>
    )

    const search = screen.getByPlaceholderText('Search')
    await fireEvent.changeText(search, 'Option 3')
    expect(screen.queryByText('Option 4')).toBeNull()
    expect(screen.getByText('Option 3')).toBeTruthy()
  })

  it('says so when a search matches nothing', async () => {
    await renderPicker(
      <SheetSurface onClosed={() => {}} title="Choose">
        <SheetPicker value="" onChange={() => {}} options={LONG_OPTIONS} />
      </SheetSurface>
    )

    await fireEvent.changeText(screen.getByPlaceholderText('Search'), 'zzz')
    expect(screen.getByText('Nothing to pick')).toBeTruthy()
  })

  it('does not show a search field for a short list', async () => {
    await renderPicker(
      <SheetSurface onClosed={() => {}} title="Allergies">
        <SheetPicker value="" onChange={() => {}} options={OPTIONS} />
      </SheetSurface>
    )

    expect(screen.queryByPlaceholderText('Search')).toBeNull()
  })
})
