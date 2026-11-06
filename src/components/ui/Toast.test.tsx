import { fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'
import { Text as RNText, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Toast } from './Toast'

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
}

const MESSAGE = 'Walking logged. 115 kcal added.'

function Harness() {
  const [open, setOpen] = useState(false)

  return (
    <View>
      <RNText testID="show" onPress={() => setOpen(true)}>
        show
      </RNText>
      <Toast open={open} message={MESSAGE} actionLabel="Undo" onAction={() => setOpen(false)} />
    </View>
  )
}

function renderToast() {
  return render(
    <SafeAreaProvider initialMetrics={METRICS}>
      <Harness />
    </SafeAreaProvider>
  )
}

describe('Toast', () => {
  it('is not on screen until something asks for it', async () => {
    await renderToast()
    expect(screen.queryByText(MESSAGE)).toBeNull()
  })

  it('appears only after an explicit call, and offers the way back', async () => {
    await renderToast()
    expect(screen.queryByText(MESSAGE)).toBeNull()

    await fireEvent.press(screen.getByTestId('show'))
    expect(await screen.findByText(MESSAGE)).toBeTruthy()
    expect(await screen.findByLabelText('Undo')).toBeTruthy()
  })

  it('undo takes it back down', async () => {
    await renderToast()

    await fireEvent.press(screen.getByTestId('show'))
    await screen.findByText(MESSAGE)

    await fireEvent.press(screen.getByLabelText('Undo'))
    expect(screen.queryByText(MESSAGE)).toBeNull()
  })
})
