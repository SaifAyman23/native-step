import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { tabs } from '@/constants/data';
import clsx from 'clsx';
import { colors, components } from '@/constants/theme';

const tabBar = components.tabBar;

export default function AppTabs() {
  const TabIcon = ({ icon, focused }: { icon: any; focused: boolean }) => (
    <View className="tabs-icon">
      <View className={clsx('tabs-pill', focused && 'tabs-active')}>
        <Image
          source={icon}
          className="tabs-glyph"
          resizeMode="contain"
        />
      </View>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ea7a53',
        tabBarInactiveTintColor: '#081126',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: tabBar.horizontalInset,
          left: '50%',
          transform: 'translateX(-50%)' as any,
          width: '90%',
          maxWidth: 500,
          height: tabBar.height,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          paddingTop: 7,
          cursor: 'pointer' as any,
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
