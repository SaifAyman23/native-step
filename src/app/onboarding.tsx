import { View, Text } from 'react-native';
import { Link } from 'expo-router';

const Onboarding = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-2xl font-bold text-foreground">Onboarding</Text>
      <Link href="/" className="mt-4 text-blue-500">
        Back to Home
      </Link>
    </View>
  );
};

export default Onboarding;