import { Pressable, Text, View } from 'react-native'

import { OAUTH_PROVIDERS } from '@/lib/constants'

export function OAuthButtons({
  onOAuth,
}: {
  onOAuth: (provider: string) => void
}) {
  return (
    <View className="w-full flex-row gap-2.5">
      {[OAUTH_PROVIDERS.GOOGLE, OAUTH_PROVIDERS.GITHUB].map((provider) => (
        <Pressable
          key={provider}
          onPress={() => onOAuth(provider)}
          className="flex-1 items-center rounded-xl border border-border bg-surface px-3 py-3"
        >
          <Text className="text-sm font-rubik-semibold capitalize text-text">
            {provider}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
