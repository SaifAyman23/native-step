import { View, Text, TouchableHighlight } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Subscriptions = () => {
  return (
    <SafeAreaView className="flex-1 bg-background px-5" edges={['top']}>
      <View className="flex-1 w-full items-center justify-center">
        <Text className="text-xl font-bold">Subscriptions</Text>
        <Link 
          href={{
            pathname: "/subscriptions/[id]",
            params: { id: "spotify" },
          }}
          asChild
        >
          <TouchableHighlight className="mt-5 rounded bg-primary px-4 py-3">
            <Text className="text-white">spotify sub</Text>
          </TouchableHighlight>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Subscriptions;
