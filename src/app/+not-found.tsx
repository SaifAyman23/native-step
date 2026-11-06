import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NotFound() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-6">
        <View className="self-center rounded-full bg-primary px-3 py-1">
          <Text className="text-xs font-rubik-semibold text-on-primary">404</Text>
        </View>
        <Text className="mt-4 text-2xl font-rubik-bold text-text">
          Page not found
        </Text>
        <Text className="mt-1.5 text-center text-sm text-text-2">
          This screen doesn&apos;t exist.
        </Text>
        <Link href="/(tabs)/(home)" asChild>
          <Pressable className="mt-6 rounded-full bg-primary px-5 py-3">
            <Text className="text-base font-rubik-semibold text-on-primary">
              Go home
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  )
}
