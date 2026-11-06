import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { extractErrorMessage } from '@/api/errors'
import { useRequestPasswordReset } from '@/api/accounts/hooks'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { validateEmail } from '@/lib/validators'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const mutation = useRequestPasswordReset()

  const handleSubmit = () => {
    setError('')
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    mutation.mutate(
      { email },
      {
        onSuccess: () => router.push('/verify-otp'),
        onError: (e: unknown) => setError(extractErrorMessage(e, 'Request failed')),
      }
    )
  }

  return (
    <AuthLayout title="Reset password" subtitle="We will send a code to your inbox.">
      <View className="gap-4">
        <FormError message={error} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
        <Button
          title={mutation.isPending ? 'Sending…' : 'Send code'}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        />
      </View>
    </AuthLayout>
  )
}
