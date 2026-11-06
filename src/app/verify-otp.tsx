import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { extractErrorMessage } from '@/api/errors'
import { useVerifyEmail } from '@/api/accounts/hooks'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { InputOTP } from '@/components/ui/InputOTP'

export default function VerifyOTP() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const mutation = useVerifyEmail()

  const handleSubmit = (raw?: string) => {
    const value = (raw ?? code).trim()
    setError('')
    if (value.length < 4) {
      setError('Please enter the code')
      return
    }
    mutation.mutate(
      { email, code: value },
      {
        onSuccess: () => router.push('/reset-password'),
        onError: (e: unknown) => setError(extractErrorMessage(e, 'Verification failed')),
      }
    )
  }

  return (
    <AuthLayout title="Check your inbox" subtitle="Enter the one-time code we sent.">
      <View className="gap-4">
        <FormError message={error} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputOTP value={code} onChange={setCode} onComplete={handleSubmit} autoFocus />
        <Button
          title={mutation.isPending ? 'Verifying…' : 'Verify'}
          onPress={() => handleSubmit()}
          disabled={mutation.isPending}
        />
      </View>
    </AuthLayout>
  )
}
