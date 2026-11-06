import { Image } from 'expo-image'
import { useState, type ReactNode } from 'react'
import { Platform, Pressable, ScrollView, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'

import { useTabBarBottomInset } from '@/components/shared/navigation/TabBarInsetContext'
import { Button, Card, Txt } from '@/components/ui'
import { ArrowRightIcon, CaretRightIcon } from '@/components/ui/icons'

interface SectionProps {
  title: string
  children: ReactNode
}

/** Chevrons + FadeIn collapsible, rebuilt on the token Card (replaces the old one). */
function Section({ title, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="gap-s3">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={`${title}: ${isOpen ? 'collapse' : 'expand'}`}
        onPress={() => setIsOpen((value) => !value)}
        className="flex-row items-center gap-s3"
      >
        <View className="h-s5 w-s5 items-center justify-center rounded-full bg-surface-3">
          <CaretRightIcon
            size={14}
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </View>
        <Txt className="text-label font-rubik-semibold text-text">{title}</Txt>
      </Pressable>
      {isOpen ? (
        <Animated.View entering={FadeIn.duration(200)} className="gap-s3">
          {children}
        </Animated.View>
      ) : null}
    </Card>
  )
}

/** Inline code chip for file/hook names, matching the old `code` text type. */
function Code({ children }: { children: ReactNode }) {
  return (
    <Txt className="rounded-sm bg-surface-3 px-1 font-rubik-medium text-caption text-text">
      {children}
    </Txt>
  )
}

export default function Home() {
  const bottomInset = useTabBarBottomInset()

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: bottomInset }}
      >
        <View className="gap-s7 pt-s2">
          <View className="gap-s3 items-center py-s7">
            <Txt className="text-display font-rubik-extrabold text-text">Explore</Txt>
            <Txt className="text-center text-body text-text-2">
              This starter app includes example{'\n'}code to help you get started.
            </Txt>
            <Button
              title="Expo documentation"
              icon={<ArrowRightIcon size={16} />}
              variant="secondary"
              size="sm"
              onPress={() => void WebBrowser.openBrowserAsync('https://docs.expo.dev')}
            />
          </View>

          <Section title="File-based routing">
            <Txt className="text-caption leading-[1.4] text-text-2">
              This app has two screens: <Code>src/app/index.tsx</Code> and{' '}
              <Code>src/app/explore.tsx</Code>
            </Txt>
            <Txt className="text-caption leading-[1.4] text-text-2">
              The layout file in <Code>src/app/_layout.tsx</Code> sets up the tab navigator.
            </Txt>
            <Button
              title="Learn more"
              variant="ghost"
              size="sm"
              onPress={() => void openUrl('https://docs.expo.dev/router/introduction')}
            />
          </Section>

          <Section title="Android, iOS, and web support">
            <Txt className="text-caption leading-[1.4] text-text-2">
              You can open this project on Android, iOS, and the web. To open the web version,
              press <Code>w</Code> in the terminal running this project.
            </Txt>
            <View className="overflow-hidden rounded-lg">
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                style={{ width: '100%', aspectRatio: 296 / 171 }}
                contentFit="cover"
                accessibilityLabel="Web tutorial screenshot"
              />
            </View>
          </Section>

          <Section title="Images">
            <Txt className="text-caption leading-[1.4] text-text-2">
              For static images, you can use the <Code>@2x</Code> and <Code>@3x</Code> suffixes to
              provide files for different screen densities.
            </Txt>
            <View className="items-center py-s2">
              <Image
                source={require('@/assets/images/react-logo.png')}
                style={{ width: 100, height: 100 }}
                contentFit="contain"
                accessibilityLabel="React Native logo"
              />
            </View>
            <Button
              title="Learn more"
              variant="ghost"
              size="sm"
              onPress={() => void openUrl('https://reactnative.dev/docs/images')}
            />
          </Section>

          <Section title="Light and dark mode components">
            <Txt className="text-caption leading-[1.4] text-text-2">
              This template has light and dark mode support. The <Code>useColorScheme()</Code> hook
              lets you inspect what the user&apos;s current color scheme is, and so you can adjust
              UI colors accordingly.
            </Txt>
            <Button
              title="Learn more"
              variant="ghost"
              size="sm"
              onPress={() =>
                void openUrl('https://docs.expo.dev/develop/user-interface/color-themes/')
              }
            />
          </Section>

          <Section title="Animations">
            <Txt className="text-caption leading-[1.4] text-text-2">
              This template includes an example of an animated component. The{' '}
              <Code>src/components/ui/collapsible.tsx</Code> component uses the powerful{' '}
              <Code>react-native-reanimated</Code> library to animate opening this hint.
            </Txt>
          </Section>

          {Platform.OS === 'web' ? (
            <Txt className="text-center text-caption text-text-3">
              Built with React Rapido Native
            </Txt>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

async function openUrl(url: string) {
  await WebBrowser.openBrowserAsync(url, {
    dismissButtonStyle: 'cancel',
    showInRecents: false,
  })
}
