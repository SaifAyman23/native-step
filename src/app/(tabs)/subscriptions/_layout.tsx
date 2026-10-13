import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionsLayout() {
  return (
    <SafeAreaView className='flex-1 p-5 bg-background'>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}

