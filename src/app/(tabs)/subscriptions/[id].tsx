import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background px-5" edges={['top']}>
      <View className="flex-1 w-full items-center justify-center">
        <Text className="text-xl font-bold">Subscription Details: {id}</Text>
        <Pressable 
          onPress={() => router.back()} 
          className="mt-5 rounded bg-primary px-4 py-2"
        >
          <Text className="text-white">Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionDetails;
