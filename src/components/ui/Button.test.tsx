import { fireEvent, render, screen } from '@testing-library/react-native'

import { Button } from './Button'

describe('Button', () => {
  test('renders title and handles press', async () => {
    const onPress = jest.fn()
    await render(<Button title="Sign in" onPress={onPress} />)
    const label = screen.getByText('Sign in')
    expect(label).toBeTruthy()
    fireEvent.press(label)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  test('disabled blocks press', async () => {
    const onPress = jest.fn()
    await render(<Button title="Saving" onPress={onPress} disabled />)
    fireEvent.press(screen.getByText('Saving'))
    expect(onPress).not.toHaveBeenCalled()
  })

  test('loading blocks press and marks the button busy', async () => {
    const onPress = jest.fn()
    await render(<Button title="Saving" onPress={onPress} loading />)

    fireEvent.press(screen.getByText('Saving'))
    expect(onPress).not.toHaveBeenCalled()

    const button = screen.getByLabelText('Saving')
    expect(button.props.accessibilityState).toMatchObject({ busy: true, disabled: true })
  })
})
