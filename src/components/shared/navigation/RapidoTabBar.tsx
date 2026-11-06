import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'

import { TabBar, type TabItem } from '@/components/ui/TabBar'
import { useTabBarHeightReporter } from './TabBarInsetContext'

interface TabRoute {
  key: string
  name: string
}

interface TabDescriptor {
  options: {
    title?: string
    tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => ReactNode
    tabBarButton?: unknown
    tabBarItemStyle?: unknown
  }
}

interface TabBarRendererProps {
  state: { index: number; routes: TabRoute[] }
  descriptors: Record<string, TabDescriptor>
  emitter: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean
    }
  }
  navigateToTab: (routeKey: string) => void
  insets: { top: number; bottom: number; left: number; right: number }
}

/**
 * The navigator's tab bar, drawn as the Rapido floating bar.
 *
 * React Navigation keeps owning navigation, history and per-tab state; this
 * only replaces how the bar is drawn. The bar floats over the scene, clears
 * the safe-area insets the navigator reports (bottom plus left/right with a
 * 22px floor, via `TabBar`), and reports its measured height through the tab
 * inset context so tab screens can keep their last row visible.
 */
export function RapidoTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: TabBarRendererProps) {
  const routes = useMemo(() => state?.routes ?? [], [state?.routes])
  const visibleRoutes = useMemo(
    () =>
      routes.filter((route) => {
        const options = descriptors?.[route.key]?.options
        const itemStyle = options?.tabBarItemStyle as { display?: string } | undefined
        return options?.tabBarButton !== null && itemStyle?.display !== 'none'
      }),
    [descriptors, routes]
  )

  const tabs = useMemo<TabItem<string>[]>(
    () =>
      visibleRoutes.map((route) => {
        const icon = descriptors?.[route.key]?.options?.tabBarIcon?.({
          focused: false,
          color: '',
          size: 22,
        })
        const label = descriptors?.[route.key]?.options?.title ?? route.name
        return {
          key: route.key,
          label,
          icon: (icon ?? <></>) as ReactElement,
        }
      }),
    [descriptors, visibleRoutes]
  )

  const reportHeight = useTabBarHeightReporter()
  const activeRouteKey = visibleRoutes.some((route) => route.key === routes[state.index]?.key)
    ? routes[state.index]?.key ?? ''
    : ''

  return (
    <TabBar
      floating
      bottomInset={insets?.bottom ?? 0}
      leftInset={insets?.left ?? 0}
      rightInset={insets?.right ?? 0}
      onHeightChange={reportHeight}
      tabs={tabs}
      activeKey={activeRouteKey}
      onChange={(key) => {
        const event = emitter.emit({ type: 'tabPress', target: key, canPreventDefault: true })
        if (event.defaultPrevented) return
        const route = routes.find((candidate) => candidate.key === key)
        if (!route) return
        navigateToTab(route.key)
      }}
    />
  )
}
