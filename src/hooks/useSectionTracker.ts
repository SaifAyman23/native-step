import { useRef, useState } from 'react'
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

export type SectionTracker<T extends string = string> = {
  active: T
  direction: 1 | -1
  onLayout: (id: T) => (e: LayoutChangeEvent) => void
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}

/**
 * Native section spy for a ScrollView. Web tracks DOM sections with
 * ScrollTrigger; here each section reports its Y via onLayout and the
 * shared onScroll handler picks the active one. Wire onScroll onto the
 * ScrollView and onLayout(id) onto each section wrapper.
 */
export function useSectionTracker<T extends string>(ids: readonly T[]): SectionTracker<T> {
  const [active, setActive] = useState<T>(ids[0])
  const [direction, setDirection] = useState<1 | -1>(1)
  const offsets = useRef<Partial<Record<T, number>>>({})
  const lastY = useRef(0)

  const onLayout = (id: T) => (e: LayoutChangeEvent) => {
    offsets.current[id] = e.nativeEvent.layout.y
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y
    const next: 1 | -1 = y >= lastY.current ? 1 : -1
    lastY.current = y
    setDirection((prev) => (prev === next ? prev : next))

    let current = ids[0]
    for (const id of ids) {
      const off = offsets.current[id]
      if (off !== undefined && y >= off - 8) current = id
    }
    setActive((prev) => (prev === current ? prev : current))
  }

  return { active, direction, onLayout, onScroll }
}
