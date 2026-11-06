import { cn } from '@/lib/utils'

import { Segmented, type SegmentOption } from './Segmented'

export type TabOption<T extends string> = SegmentOption<T>

interface TabsProps<T extends string> {
  value: T
  options: readonly TabOption<T>[]
  onChange: (value: T) => void
  accessibilityLabel?: string
  className?: string
}

/**
 * Segmented segments that navigate instead of selecting: the Diary sub-tabs.
 *
 * There is no underline variant in this design system, and there is not one here
 * either. This is `Segmented`, so a strip of segments behaves identically wherever
 * it appears; having a second tab component with its own background treatment is
 * how two controls on one screen end up looking like they are in different states.
 */
export function Tabs<T extends string>({
  value,
  options,
  onChange,
  accessibilityLabel,
  className,
}: TabsProps<T>) {
  return (
    <Segmented
      subnav
      value={value}
      options={options}
      onChange={onChange}
      accessibilityLabel={accessibilityLabel}
      className={cn('w-full self-stretch', className)}
    />
  )
}
