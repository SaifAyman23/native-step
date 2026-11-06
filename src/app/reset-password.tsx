import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { TextInput, View, type TextInputInstance } from 'react-native'

import { extractErrorMessage } from '@/api/errors'
import { useConfirmPasswordReset } from '@/api/accounts/hooks'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { InputOTP } from '@/components/ui/InputOTP'
import { validatePassword } from '@/lib/validators'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const mutation = useConfirmPasswordReset()
  const confirmRef = useRef<TextInputInstance>(null)

  const handleSubmit = () => {
    setError('')
    if (!email || !code.trim()) {
      setError('Please enter the reset code and email')
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
    mutation.mutate(
      { email, code: code.trim(), new_password: password },
      {
        onSuccess: () => router.replace('/login'),
        onError: (e: unknown) => setError(extractErrorMessage(e, 'Reset failed')),
      }
    )
  }

  return (
    <AuthLayout title="New password" subtitle="Choose a strong password.">
      <View className="gap-4">
        <FormError message={error} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputOTP value={code} onChange={setCode} />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
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
          title={mutation.isPending ? 'Saving…' : 'Save'}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        />
      </View>
    </AuthLayout>
  )
}
