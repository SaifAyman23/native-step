export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (
  password: string
): {
  isValid: boolean
  strength: 'weak' | 'fair' | 'good' | 'strong'
} => {
  const length = password.length
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
  let isValid = false

  if (length < 6) {
    strength = 'weak'
  } else if (length >= 6 && length < 8) {
    strength = 'fair'
    isValid = hasUpperCase && hasLowerCase
  } else if (length >= 8 && length < 12) {
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
    if (score >= 3) {
      strength = 'good'
      isValid = true
    } else {
      strength = 'fair'
      isValid = hasUpperCase && hasLowerCase
    }
  } else {
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
    if (score >= 3) {
      strength = 'strong'
      isValid = true
    } else {
      strength = 'good'
      isValid = hasUpperCase && hasLowerCase
    }
  }

  return { isValid, strength }
}

export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name)
}
