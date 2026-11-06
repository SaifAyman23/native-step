import { Link, router } from 'expo-router'
import { useRef, useState } from 'react'
import { Pressable, Text, TextInput, View, type TextInputInstance } from 'react-native'

import { extractErrorMessage } from '@/api/errors'
import { useLogin } from '@/api/accounts/hooks'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { validateEmail } from '@/lib/validators'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const loginMutation = useLogin()
  const passwordRef = useRef<TextInputInstance>(null)

  const handleSubmit = () => {
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => router.replace('/(tabs)/(home)'),
        onError: (e: unknown) => setError(extractErrorMessage(e, 'Login failed')),
      }
    )
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue.">
      <View className="gap-4">
        <FormError message={error} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-rubik-semibold text-text">Password</Text>
            <Link href="/forgot-password" asChild>
              <Pressable hitSlop={8}>
                <Text className="text-sm font-rubik-medium text-primary-text">Forgot?</Text>
              </Pressable>
            </Link>
          </View>
          <Input
            label=""
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            inputRef={passwordRef}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
          />
        </View>
        <Button
          title={loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          onPress={handleSubmit}
          disabled={loginMutation.isPending}
          variant="secondary"
        />
        <View className="mt-1 flex-row justify-center">
          <Text className="text-sm text-text-2">No account? </Text>
          <Link href="/register" asChild>
            <Pressable hitSlop={8}>
              <Text className="text-sm font-rubik-semibold text-primary-text">Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </AuthLayout>
  )
}
