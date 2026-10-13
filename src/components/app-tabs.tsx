import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { tabs } from '@/constants/data';
import clsx from 'clsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, components } from '@/constants/theme';

const tabBar = components.tabBar

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  const TabIcon = ({ icon, focused }: { icon: any; focused: boolean }) => (
    <View className={"tabs-icon"}>
      <View className={clsx('tabs-pill', focused && 'tabs-active')}>
        <Image
          source={icon}
          className='tabs-glyph'
          resizeMode="contain"
        />
      </View>
    </View>
  )

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ea7a53',    // Your accent color
        tabBarInactiveTintColor: '#081126',  // Your primary/muted color
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, tabBar.horizontalInset), // Ensure it doesn't go below the safe area
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          // paddingVertical: tabBar.height/2 - tabBar.iconFrame/1.6,
          paddingTop: 7,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: 'center',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}