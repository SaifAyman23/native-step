import "@/global.css";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 w-full items-center justify-center bg-white dark:bg-black ios:pt-12 android:pt-4 web:pt-0">
      <Text className="text-xl font-bold text-black dark:text-white ios:text-blue-500 android:text-green-500 web:text-red-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}