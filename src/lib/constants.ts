export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'React Rapido Native'

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || ''

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
} as const

export const ROUTES = {
  HOME: '/(tabs)',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',
  RESET_PASSWORD: '/reset-password',
} as const

export const CONTACT = {
  email: process.env.EXPO_PUBLIC_CONTACT_EMAIL || '',
  github: process.env.EXPO_PUBLIC_GITHUB_URL || '',
  linkedin: process.env.EXPO_PUBLIC_LINKEDIN_URL || '',
} as const
