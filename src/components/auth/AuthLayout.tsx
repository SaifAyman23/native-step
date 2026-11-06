import type { ReactNode } from 'react'
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 py-10">
            <View className="self-start rounded-full bg-primary px-3 py-1">
              <Text className="text-xs font-rubik-semibold text-on-primary">React Rapido</Text>
            </View>
            <Text className="mt-4 text-3xl font-rubik-bold tracking-tight text-text">
              {title}
            </Text>
            <Text className="mt-1.5 text-sm leading-5 text-text-2">
              {subtitle}
            </Text>
            <View className="mt-6">{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
