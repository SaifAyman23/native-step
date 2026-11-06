import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ModeToggle } from '@/components/theme/ModeToggle'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { APP_NAME, ROUTES } from '@/lib/constants'

const HIGHLIGHTS = [
  ['Touch', '44pt', 'Targets'],
  ['Motion', '60fps', 'UI thread'],
  ['Ship', 'OTA', 'No review'],
] as const

const FEATURES = [
  { t: 'Thin screens', d: 'Screens compose, they don’t own. Data flows via props.', tag: 'Architecture' },
  { t: '3-file API', d: 'Endpoints, hooks, and barrel exports. One pattern.', tag: 'Data' },
  { t: 'Auth ready', d: 'Token auth with OTP and SecureStore built in.', tag: 'Secure' },
  { t: 'Native motion', d: 'Reanimated springs and gestures at 60fps.', tag: 'Motion' },
  { t: 'Tabs + routing', d: 'Bottom tabs, deep links, one codebase.', tag: 'Expo Router' },
  { t: 'Haptics + theme', d: 'Tappable feel with dark-first styling.', tag: 'Feel' },
] as const

export function LandingPage() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}>
        <View className="flex-row items-center justify-between border-b border-border px-5 py-3">
          <View className="flex-row items-center gap-2.5">
            <Image
              source={require('@/assets/images/logo-sm.png')}
              style={{ width: 36, height: 36, borderRadius: 10 }}
              accessibilityLabel="React Rapido logo"
            />
            <Text className="text-base font-rubik-bold text-text">
              React Rapido
            </Text>
          </View>
          <Link href={ROUTES.LOGIN} asChild>
            <Pressable className="rounded-full bg-primary px-4 py-2">
              <Text className="text-sm font-rubik-semibold text-on-primary">Demo</Text>
            </Pressable>
          </Link>
        </View>

        <View className="px-5 py-7">
          <View className="self-start rounded-full bg-primary px-3 py-1">
            <Text className="text-xs font-rubik-semibold text-on-primary">Ready to ship</Text>
          </View>
          <Text className="mt-3 text-xs text-text-2">
            Mobile starter · {APP_NAME}
          </Text>
          <Text className="mt-2 text-8xl font-rubik-bold leading-none tracking-tight text-text">
            Build native.
          </Text>
          <Text className="mt-4 text-base leading-6 text-text-2">
            Thin screens, reusable components, and one API pattern. Auth, tabs, and motion are
            already handled — you build the product.
          </Text>

          <View className="mt-6 gap-2.5">
            <Link href={ROUTES.REGISTER} asChild>
              <Pressable className="items-center rounded-full bg-primary px-5 py-3.5">
                <Text className="text-base font-rubik-semibold text-on-primary">Get started</Text>
              </Pressable>
            </Link>
            <Link href={ROUTES.LOGIN} asChild>
              <Pressable className="items-center rounded-full border border-border px-5 py-3.5">
                <Text className="text-base font-rubik-semibold text-text">
                  View stack
                </Text>
              </Pressable>
            </Link>
          </View>

          <View className="mt-6 flex-row rounded-2xl border border-border">
            {HIGHLIGHTS.map(([k, v, s], i) => (
              <View
                key={k}
                className={`flex-1 p-3.5 ${i > 0 ? 'border-l border-border' : ''}`}
              >
                <Text className="text-xs text-text-2">{k}</Text>
                <Text className="mt-0.5 text-base font-rubik-bold text-text">
                  {v}
                </Text>
                <Text className="text-xs font-rubik-medium text-success">{s}</Text>
              </View>
            ))}
          </View>

          <View className="mt-6 gap-3">
            {FEATURES.map((f) => (
              <Card key={f.t}>
                <Badge text={f.tag} />
                <Text className="mt-2.5 text-base font-rubik-bold text-text">
                  {f.t}
                </Text>
                <Text className="mt-1 text-sm leading-5 text-text-2">
                  {f.d}
                </Text>
              </Card>
            ))}
          </View>

          <View className="mt-6 rounded-2xl bg-primary px-5 py-4">
            <Text className="text-base font-rubik-semibold text-on-primary">
              Built for thumbs, not cursors.
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <Text className="text-sm font-rubik-semibold text-text">
              Appearance
            </Text>
            <ModeToggle />
          </View>

          <View className="mt-6 items-center pb-2">
            <Text className="text-xs text-text-3">
              © 2026 React Rapido Native · Clean · Fast · Solid
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
