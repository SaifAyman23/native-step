import { fireEvent, render, screen } from '@testing-library/react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Select } from '@/components/ui/Select'
import { SheetHost } from '@/components/ui/SheetHost'

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
}

const OPTIONS = [
  { value: 'walk', label: 'Walking', sub: '4 km/h, 32 min' },
  { value: 'run', label: 'Running', sub: '8 km/h' },
]

describe('Select', () => {
  it('shows the current value and opens the sheet on press', async () => {
    await render(
      <GestureHandlerRootView>
        <SafeAreaProvider initialMetrics={METRICS}>
          <SheetHost>
            <Select label="Activity" value="walk" options={OPTIONS} onChange={() => {}} />
          </SheetHost>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    )

    expect(screen.getByText('Walking')).toBeTruthy()

    await fireEvent.press(screen.getByLabelText('Activity: Walking'))
    expect(await screen.findByText('Running')).toBeTruthy()
  })

  it('opens without a nested virtualized list error', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})

    await render(
      <GestureHandlerRootView>
        <SafeAreaProvider initialMetrics={METRICS}>
          <SheetHost>
            <Select label="Activity" value="walk" options={OPTIONS} onChange={() => {}} />
          </SheetHost>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    )

    await fireEvent.press(screen.getByLabelText('Activity: Walking'))
    await screen.findByText('Running')

    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })

  it('reports the picked value and closes the sheet', async () => {
    const onChange = jest.fn()

    await render(
      <GestureHandlerRootView>
        <SafeAreaProvider initialMetrics={METRICS}>
          <SheetHost>
            <Select label="Activity" value="walk" options={OPTIONS} onChange={onChange} />
          </SheetHost>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    )

    await fireEvent.press(screen.getByLabelText('Activity: Walking'))
    await screen.findByText('Running')

    await fireEvent.press(screen.getByText('Running'))
    expect(onChange).toHaveBeenCalledWith('run')
  })

  it('does not open when disabled', async () => {
    await render(
      <GestureHandlerRootView>
        <SafeAreaProvider initialMetrics={METRICS}>
          <SheetHost>
            <Select
              label="Activity"
              value=""
              options={OPTIONS}
              onChange={() => {}}
              disabled
            />
          </SheetHost>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    )

    await fireEvent.press(screen.getByLabelText('Activity: Select'))
    expect(screen.queryByText('Running')).toBeNull()
  })
})
