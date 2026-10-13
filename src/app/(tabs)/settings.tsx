import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-background px-5" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-foreground">Settings</Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;