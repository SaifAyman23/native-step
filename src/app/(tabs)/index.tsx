import "@/global.css";
import { Link } from "expo-router";
import { Text, TouchableHighlight, TouchableNativeFeedback, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 w-full items-center justify-center bg-background ios:pt-12 android:pt-4 web:pt-0">
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
      {/* <Link href="/(tabs)/(subscriptions)/subscriptions/spotify" asChild> */}
      <Link 
        href={{
          pathname: "/(tabs)/(subscriptions)/subscriptions/[id]",
          params: { id: "claude" },
        }}
        asChild
      >
        <TouchableNativeFeedback className="mt-5 rounded bg-primary px-4 py-3">
          <Text className="text-white">spotify sub</Text>
        </TouchableNativeFeedback>
      </Link>
      <Link 
        href={{
          pathname: "/(tabs)/(subscriptions)/subscriptions/[id]",
          params: { id: "claude" },
        }}
        asChild>
        <TouchableHighlight className="mt-5 rounded bg-primary px-4 py-3">
          <Text className="text-white">claude sub</Text>
        </TouchableHighlight>
      </Link>
    </View>
  );
}