import { View, Text } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams } from 'expo-router'

const SubscriptionDetails = () => {

    const { id } = useLocalSearchParams<{id: string}>()

  return (
    <View className="flex-1 w-full items-center justify-center bg-background ios:pt-12 android:pt-4 web:pt-0">
      <Text>Subscription Details: {id}</Text>
      <Link href="/">Back</Link>
    </View>
  )
}

export default SubscriptionDetails