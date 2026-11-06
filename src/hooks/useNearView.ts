import { useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'

export type NearViewOptions = {
  threshold?: number
}

/**
 * Native near-viewport check. Web uses IntersectionObserver; here the section
 * reports its Y via onLayout and the parent feeds scroll position + viewport
 * height back through onScroll. Defaults to true so content never flashes
 * missing before the first measurement.
 */
export function useNearView(options?: NearViewOptions) {
  const threshold = options?.threshold ?? 0
  const [near, setNear] = useState(true)
  const [layoutY, setLayoutY] = useState<number | null>(null)

  const onLayout = (e: LayoutChangeEvent) => {
    setLayoutY(e.nativeEvent.layout.y)
  }

  const onScroll = (scrollY: number, viewportHeight: number) => {
    if (layoutY === null) return
    const next = scrollY + viewportHeight * (1 + threshold) >= layoutY
    setNear((prev) => (prev === next ? prev : next))
  }

  return { near, onLayout, onScroll }
}
