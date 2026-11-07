import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ar from './locales/ar'
import en from './locales/en'

const resources = {
  en: {
    translation: {
      ...en.common,
      ...en.onboarding,
      ...en.billing,
      ...en.activity,
      ...en.ai,
      ...en.account,
      ...en.notifications,
      ...en.client,
    },
  },
  ar: {
    translation: {
      ...ar.common,
      ...ar.onboarding,
      ...ar.billing,
      ...ar.activity,
      ...ar.ai,
      ...ar.account,
      ...ar.notifications,
      ...ar.client,
    },
  },
}

const initialLanguage = process.env.EXPO_PUBLIC_LANGUAGE === 'ar' ? 'ar' : 'en'

const initPromise = i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
  react: {
    useSuspense: false,
  },
  missingKeyHandler: (ns, key, fallback) => {
    // Return the key itself so UI shows the key name instead of crashing
    // This prevents "Text strings must be rendered within a <Text> component" error
    return fallback
  },
})

export { initPromise }
export default i18n
