import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View className="flex-1 w-full items-center justify-center bg-background ios:pt-12 android:pt-4 web:pt-0">
      <Text>SignIn</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  )
}

export default SignIn