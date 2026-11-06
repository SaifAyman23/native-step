import { Text, View } from 'react-native'

export function FormDivider({ text = 'or' }: { text?: string }) {
  return (
    <View className="w-full flex-row items-center gap-3">
      <View className="h-px flex-1 bg-border" />
      <Text className="text-xs text-text-3">{text}</Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  )
}
