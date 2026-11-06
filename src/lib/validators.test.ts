import { validateEmail, validateName, validatePassword } from './validators'

describe('validators', () => {
  test('validateEmail accepts valid addresses', () => {
    expect(validateEmail('name@example.com')).toBe(true)
    expect(validateEmail('a.b+tag@sub.domain.co')).toBe(true)
  })

  test('validateEmail rejects invalid addresses', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail('not-an-email')).toBe(false)
    expect(validateEmail('a@b')).toBe(false)
  })

  test('validatePassword grades strength', () => {
    expect(validatePassword('abc').isValid).toBe(false)
    expect(validatePassword('Abcdef').isValid).toBe(true)
    expect(validatePassword('Abcdef1!').strength).toBe('good')
    expect(validatePassword('Abcdefghij1!').strength).toBe('strong')
  })

  test('validateName requires letters', () => {
    expect(validateName('Saif')).toBe(true)
    expect(validateName('A')).toBe(false)
    expect(validateName('R2D2')).toBe(false)
  })
})
