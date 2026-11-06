import { render } from '@testing-library/react-native'

import { Button } from './Button'

function classesIn(tree: unknown): string[] {
  const found: string[] = []

  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const entry = node as { props?: { className?: string }; children?: unknown }
    if (typeof entry.props?.className === 'string') {
      found.push(entry.props.className)
    }
    if (Array.isArray(entry.children)) entry.children.forEach(walk)
  }

  walk(tree)
  return found
}

describe('Button edge', () => {
  it.each([
    ['primary', 'bg-primary-edge'],
    ['green', 'bg-success-edge'],
    ['danger', 'bg-error-edge'],
    ['secondary', 'bg-border-strong'],
    ['tonal', 'bg-primary'],
  ] as const)('gives the %s variant its own edge colour', async (variant, edge) => {
    const view = await render(<Button title="Go" variant={variant} onPress={() => {}} />)
    expect(classesIn(view.toJSON()).join(' ')).toContain(edge)
  })

  it('keeps the ghost variant flat, because it has no face to sit on', async () => {
    const view = await render(<Button title="Skip" variant="ghost" onPress={() => {}} />)
    const classes = classesIn(view.toJSON()).join(' ')
    expect(classes).not.toContain('bg-primary-edge')
    expect(classes).not.toContain('bg-border-strong')
  })

  it('drops the brand colour from the edge when the button is disabled', async () => {
    const view = await render(<Button title="Go" variant="primary" disabled onPress={() => {}} />)
    const classes = classesIn(view.toJSON()).join(' ')
    expect(classes).toContain('bg-border-strong')
    expect(classes).not.toContain('bg-primary-edge')
  })

  it('drops the brand colour from the edge while it is loading', async () => {
    const view = await render(<Button title="Go" variant="danger" loading onPress={() => {}} />)
    const classes = classesIn(view.toJSON()).join(' ')
    expect(classes).toContain('bg-border-strong')
    expect(classes).not.toContain('bg-error-edge')
  })
})
