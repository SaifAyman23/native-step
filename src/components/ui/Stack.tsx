import type { ReactNode } from 'react'
import { View } from 'react-native'

import { cn } from '@/lib/utils'

interface StackProps {
  children: ReactNode
  direction?: 'column' | 'row'
  gap?: 'none' | 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  className?: string
}

const gaps = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
} as const

const aligns = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const

const justifies = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const

export function Stack({
  children,
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className,
}: StackProps) {
  return (
    <View
      className={cn(
        'w-full',
        direction === 'row' && 'flex-row',
        gaps[gap],
        aligns[align],
        justifies[justify],
        className
      )}
    >
      {children}
    </View>
  )
}
