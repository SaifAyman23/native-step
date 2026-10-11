import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="subscriptions/[id]" />
    </Stack>
  );
}

