import { Text, View } from 'react-native'

import { validatePassword } from '@/lib/validators'

const strengthColors: Record<string, string> = {
  weak: 'bg-error',
  fair: 'bg-warning',
  good: 'bg-success',
  strong: 'bg-success',
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const { strength } = validatePassword(password)
  return (
    <View className="w-full flex-row items-center gap-2">
      <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-track">
        <View className={`h-1.5 rounded-full ${strengthColors[strength]}`} />
      </View>
      <Text className="text-xs capitalize text-text-2">{strength}</Text>
    </View>
  )
}
