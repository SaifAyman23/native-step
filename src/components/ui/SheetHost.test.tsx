import { fireEvent, render, screen } from '@testing-library/react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Text as RNText, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { SheetPicker, SheetSurface, type SheetOption } from '@/components/ui/Sheet'
import { SheetHost, useSheet } from '@/components/ui/SheetHost'

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
}

function renderHost(node: React.ReactNode) {
  return render(
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={METRICS}>
        <SheetHost>{node}</SheetHost>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const OPTIONS: SheetOption[] = [
  { value: 'walk', label: 'Walking', sub: '4 km/h, 32 min, 3,800 steps' },
  { value: 'run', label: 'Running', sub: '8 km/h' },
]

function Trigger({ node }: { node: React.ReactNode }) {
  const { present, back, canGoBack } = useSheet()

  return (
    <View>
      <RNText testID="open" onPress={() => present(node)}>
        open
      </RNText>
      <RNText testID="back" onPress={back}>
        back
      </RNText>
      <RNText testID="depth">{String(canGoBack)}</RNText>
    </View>
  )
}

const PICKER_SHEET = (
  <SheetSurface onClosed={() => {}} title="Activity">
    <SheetPicker value="" onChange={() => {}} options={OPTIONS} />
  </SheetSurface>
)

const FORM_SHEET = (
  <SheetSurface onClosed={() => {}} title="Walking">
    <View testID="form">
      <RNText>How long?</RNText>
    </View>
  </SheetSurface>
)

function AutoOpen() {
  const { present, replace } = useSheet()
  return (
    <View>
      <RNText testID="open" onPress={() => present(PICKER_SHEET)}>
        open
      </RNText>
      <RNText testID="push" onPress={() => present(FORM_SHEET)}>
        push
      </RNText>
      <RNText testID="swap" onPress={() => replace(FORM_SHEET)}>
        swap
      </RNText>
    </View>
  )
}

describe('SheetHost stack', () => {
  it('opens a sheet with no history', async () => {
    await renderHost(<AutoOpen />)

    await fireEvent.press(screen.getByTestId('open'))
    expect(await screen.findByText('Activity')).toBeTruthy()
    expect(await screen.findByText('Walking')).toBeTruthy()
  })

  it('pushes a step and offers a way back', async () => {
    await renderHost(<AutoOpen />)

    await fireEvent.press(screen.getByTestId('open'))
    await screen.findByText('Activity')

    await fireEvent.press(screen.getByTestId('push'))
    expect(await screen.findByTestId('form')).toBeTruthy()
    expect(await screen.findByLabelText('Back')).toBeTruthy()
  })

  it('replaces a step in place, with no way back', async () => {
    await renderHost(<AutoOpen />)

    await fireEvent.press(screen.getByTestId('open'))
    await screen.findByText('Activity')

    await fireEvent.press(screen.getByTestId('swap'))
    expect(await screen.findByTestId('form')).toBeTruthy()
    expect(screen.queryByLabelText('Back')).toBeNull()
  })

  it('goes back to the previous step', async () => {
    await renderHost(<Trigger node={PICKER_SHEET} />)

    await fireEvent.press(screen.getByTestId('open'))
    await screen.findByText('Activity')

    await fireEvent.press(screen.getByTestId('open'))
    expect((await screen.findByTestId('depth')).props.children).toBe('true')

    await fireEvent.press(screen.getByLabelText('Back'))
    expect(await screen.findByText('Activity')).toBeTruthy()
    expect(screen.queryByLabelText('Back')).toBeNull()
  })
})
