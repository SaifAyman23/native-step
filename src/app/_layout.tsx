import '@/global.css'

import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  Rubik_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/rubik'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router/stack'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { I18nextProvider } from 'react-i18next'

import { loadSession } from '@/api/session'
import { SheetHost } from '@/components/ui/SheetHost'
import { queryClient } from '@/lib/queryClient'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth/authStore'
import { useResolvedScheme } from '@/store/theme/themeStore'
import { darkThemeVars, lightThemeVars } from '@/theme/vars'
import i18n, { initPromise } from '@/i18n'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const scheme = useResolvedScheme()
  const [tokenReady, setTokenReady] = useState(false)
  const [i18nReady, setI18nReady] = useState(i18n.isInitialized)
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
    Rubik_800ExtraBold,
  })

  useEffect(() => {
    let mounted = true

    loadSession()
      .then((session) => useAuthStore.getState().setHasSession(!!session))
      .catch(() => useAuthStore.getState().setHasSession(false))
      .finally(() => {
        if (mounted) setTokenReady(true)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    initPromise.then(() => {
      if (mounted) setI18nReady(true)
    })

    return () => {
      mounted = false
    }
  }, [])

  const ready = fontsLoaded && i18nReady && tokenReady

  useEffect(() => {
    if (ready) SplashScreen.hideAsync()
  }, [ready])

  if (!ready) return null

  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <QueryClientProvider client={queryClient}>
            <View
              className={cn('flex-1', scheme === 'dark' && 'dark')}
              style={scheme === 'dark' ? darkThemeVars : lightThemeVars}
            >
              <SheetHost>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="register" />
                  <Stack.Screen name="forgot-password" />
                  <Stack.Screen name="verify-otp" />
                  <Stack.Screen name="reset-password" />
                </Stack>
              </SheetHost>
            </View>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  )
}
