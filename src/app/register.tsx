import { Link, router } from 'expo-router'
import { useRef, useState } from 'react'
import { Pressable, Text, TextInput, View, type TextInputInstance } from 'react-native'

import { extractErrorMessage } from '@/api/errors'
import { useRegister } from '@/api/accounts/hooks'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { validateEmail, validateName, validatePassword } from '@/lib/validators'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const registerMutation = useRegister()
  const emailRef = useRef<TextInputInstance>(null)
  const passwordRef = useRef<TextInputInstance>(null)
  const confirmRef = useRef<TextInputInstance>(null)

  const handleSubmit = () => {
    setError('')
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields')
      return
    }
    if (!validateName(name)) {
      setError('Please enter a valid name')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!validatePassword(password).isValid) {
      setError('Password is too weak')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    registerMutation.mutate(
      { email, password, role: 'client' },
      {
        onSuccess: () => router.replace('/login'),
        onError: (e: unknown) => setError(extractErrorMessage(e, 'Registration failed')),
      }
    )
  }

  return (
    <AuthLayout title="Create account" subtitle="Get started in seconds.">
      <View className="gap-4">
        <FormError message={error} />
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          inputRef={emailRef}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          inputRef={passwordRef}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />
        <PasswordStrength password={password} />
        <Input
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          inputRef={confirmRef}
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />
        <Button
          title={registerMutation.isPending ? 'Creating…' : 'Create account'}
          onPress={handleSubmit}
          disabled={registerMutation.isPending}
          variant="secondary"
        />
        <View className="mt-1 flex-row justify-center">
          <Text className="text-sm text-text-2">Have an account? </Text>
          <Link href="/login" asChild>
            <Pressable hitSlop={8}>
              <Text className="text-sm font-rubik-semibold text-primary-text">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </AuthLayout>
  )
}
