import "@/global.css";
import { Link } from "expo-router";
import { Text, TouchableHighlight, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background px-5" edges={['top']}>
      <View className="flex-1 w-full items-center justify-center">
        <Text className="text-xl font-bold text-success">
          Welcome to Nativewind!
        </Text>
        <Link href="/onboarding" asChild>
          <TouchableHighlight className="mt-5 rounded bg-primary px-4 py-3">
            <Text className="text-white">onboarding</Text>
          </TouchableHighlight>
        </Link>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableHighlight className="mt-5 rounded bg-primary px-4 py-3">
            <Text className="text-white">sign up</Text>
          </TouchableHighlight>
        </Link>
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
        <Link 
          href={{
            pathname: "/subscriptions/[id]",
            params: { id: "claude" },
          }}
          asChild>
          <TouchableHighlight className="mt-5 rounded bg-primary px-4 py-3">
            <Text className="text-white">claude sub</Text>
          </TouchableHighlight>
        </Link>
      </View>
    </SafeAreaView>
  );
}