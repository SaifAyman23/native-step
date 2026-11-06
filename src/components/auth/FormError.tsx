import { Text, View } from 'react-native'

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <View
      role="alert"
      className="w-full rounded-xl border border-error bg-error-bg px-3.5 py-2.5"
    >
      <Text selectable className="text-sm text-error-text">{message}</Text>
    </View>
  )
}
