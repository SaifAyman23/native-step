import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignUp = () => {
  return (
    <View className="flex-1 w-full items-center justify-center bg-background ios:pt-12 android:pt-4 web:pt-0">
      <Text>Sign Up</Text>
      <Link href="/(auth)/sign-in">Sign In</Link>
    </View>
  )
}

export default SignUp