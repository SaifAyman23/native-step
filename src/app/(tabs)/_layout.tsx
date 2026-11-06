import { Tabs } from 'expo-router'

import { RapidoTabBar } from '@/components/shared/navigation/RapidoTabBar'
import { TabBarInsetProvider } from '@/components/shared/navigation/TabBarInsetContext'
import { HouseIcon, SparkleIcon, SquaresFourIcon } from '@/components/ui/icons'

export const unstable_settings = {
  anchor: '(home)',
  backBehavior: 'initialRoute',
}

/**
 * Tabs navigator with the Rapido floating bar. React Navigation owns the
 * navigation, history and per-tab state; `tabBar` only replaces how the bar
 * is drawn, so there is no second navigator and no competing back behaviour.
 *
 * Each tab stack keeps the scene mounted (`freezeOnBlur`) so its scroll
 * position survives switching; the bar clears the safe-area insets the
 * navigator reports and measures its own height into the inset context.
 */
export default function TabsLayout() {
  return (
    <TabBarInsetProvider>
      <Tabs
        backBehavior="initialRoute"
        tabBar={(props) => <RapidoTabBar {...props} />}
        screenOptions={{ headerShown: false, freezeOnBlur: true }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            tabBarIcon: () => <HouseIcon />,
          }}
        />
        <Tabs.Screen
          name="(showcase)"
          options={{
            title: 'Components',
            tabBarIcon: () => <SquaresFourIcon />,
          }}
        />
        <Tabs.Screen
          name="(examples)"
          options={{
            title: 'Examples',
            tabBarIcon: () => <SparkleIcon />,
          }}
        />
      </Tabs>
    </TabBarInsetProvider>
  )
}
