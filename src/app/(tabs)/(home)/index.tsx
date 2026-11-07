import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTabBarBottomInset } from '@/components/shared/navigation/TabBarInsetContext'
import {
  Badge,
  Button,
  Card,
  ListRow,
  Rows,
  SectionHead,
  Txt,
} from '@/components/ui'
import {
  ArrowRightIcon,
  CheckIcon,
  GaugeIcon,
  LightningIcon,
  PaletteIcon,
  SparkleIcon,
  SquaresFourIcon,
} from '@/components/ui/icons'

export default function Home() {
  const bottomInset = useTabBarBottomInset()
  const router = useRouter()

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: bottomInset,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6 pt-2">
          {/* Hero */}
          <View className="items-center gap-3 py-6">
            <View className="self-center rounded-full bg-primary-tint px-4 py-2">
              <Txt className="text-caption font-rubik-semibold text-primary-text">RAPIDO · EXPO TEMPLATE</Txt>
            </View>
            <Txt className="text-display font-rubik-extrabold text-center text-text">Build Faster</Txt>
            <Txt className="text-center text-body leading-[1.35] text-text-2">
              A production Expo starter on Rapido tokens — 60+ components, 60fps motion and light/dark themes out of the box.
            </Txt>
            <View className="flex-row flex-wrap justify-center gap-3 pt-1">
              <Button
                title="Browse components"
                variant="primary"
                icon={<ArrowRightIcon size={16} />}
                onPress={() => router.push('/(tabs)/(showcase)')}
              />
              <Button
                title="Expo docs"
                variant="secondary"
                onPress={() => void WebBrowser.openBrowserAsync('https://docs.expo.dev')}
              />
            </View>
          </View>

          {/* Stat strip — Card usage */}
          <Card>
            <View className="flex-row items-center justify-around">
              <View className="items-center gap-1">
                <Txt className="text-h3 font-rubik-bold text-text" numeric>60+</Txt>
                <Txt className="text-caption text-text-3">Components</Txt>
              </View>
              <View className="h-8 w-px bg-border" />
              <View className="items-center gap-1">
                <Txt className="text-h3 font-rubik-bold text-text" numeric>60fps</Txt>
                <Txt className="text-caption text-text-3">Motion</Txt>
              </View>
              <View className="h-8 w-px bg-border" />
              <View className="items-center gap-1">
                <Txt className="text-h3 font-rubik-bold text-text" numeric>1 file</Txt>
                <Txt className="text-caption text-text-3">Tokens</Txt>
              </View>
            </View>
          </Card>

          {/* Why it moves fast — Rows / ListRow usage */}
          <SectionHead title="Why Rapido moves fast" />
          <Rows>
            <ListRow
              icon={<LightningIcon size={20} />}
              iconTone="orange"
              title="UI-thread motion"
              sub="Springs on touches, timing on states — layout never animates"
              value="60"
              valueUnit="fps"
            />
            <ListRow
              icon={<GaugeIcon size={20} />}
              iconTone="green"
              title="Engines under the hood"
              sub="Expo Router · Gesture Handler · SheetHost · Zustand · React Query"
            />
            <ListRow
              icon={<PaletteIcon size={20} />}
              iconTone="sky"
              title="One source of truth"
              sub="Violet #8B5CF6 + zinc · Rubik · CSS-variable light and dark"
              value="1"
              valueUnit="file"
            />
          </Rows>

          {/* Day one — Rows with navigation */}
          <SectionHead title="What you get on day one" />
          <Rows>
            <ListRow
              icon={<CheckIcon size={20} />}
              iconTone="green"
              title="60+ primitives"
              sub="Button · Card · Input · Sheet · Toast — gallery tested"
              navigate
              onPress={() => router.push('/(tabs)/(showcase)')}
            />
            <ListRow
              icon={<CheckIcon size={20} />}
              iconTone="green"
              title="Sheets that survive taps"
              sub="Mounted at the root, state commits on confirm"
            />
            <ListRow
              icon={<CheckIcon size={20} />}
              iconTone="green"
              title="Floating tab bar"
              sub="Clears the home indicator and remembers scroll"
            />
          </Rows>

          {/* Ship from here — tinted Card usage */}
          <Card className="border-primary bg-primary-tint">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface">
                <SquaresFourIcon size={20} color="primary-text" />
              </View>
              <View className="flex-1 gap-1">
                <Txt className="text-label font-rubik-semibold text-text">Ship from here</Txt>
                <Txt className="text-caption leading-[1.4] text-text-2">
                  Clone, rename, then pull any primitive from the Components tab into your screen — no mocks, no forks.
                </Txt>
              </View>
              <Badge label="Go" tone="brand" />
            </View>
            <View className="pt-3">
              <Button
                title="Open the library"
                variant="tonal"
                block
                icon={<SparkleIcon size={16} />}
                onPress={() => router.push('/(tabs)/(showcase)')}
              />
            </View>
          </Card>

          <Txt className="text-center text-caption text-text-3">Rapido — clone, rename, ship.</Txt>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
