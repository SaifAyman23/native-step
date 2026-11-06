import { resolveConnection } from './useConnection'

describe('resolveConnection', () => {
  it('follows the device in auto mode', () => {
    expect(resolveConnection('auto', true)).toBe(true)
    expect(resolveConnection('auto', false)).toBe(false)
    expect(resolveConnection('auto', null)).toBeNull()
  })

  it('forces offline regardless of the device', () => {
    expect(resolveConnection('offline', true)).toBe(false)
    expect(resolveConnection('offline', null)).toBe(false)
  })

  it('forces online regardless of the device', () => {
    expect(resolveConnection('online', false)).toBe(true)
    expect(resolveConnection('online', null)).toBe(true)
  })
})
