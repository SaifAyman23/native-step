import { View } from 'react-native'

import { cn } from '@/lib/utils'

import { Txt as Text } from './Txt'

export interface NumberedStep {
  title: string
  body?: string
}

interface NumberedStepsProps {
  steps: readonly NumberedStep[]
  className?: string
}

/** Ordered explanation steps: a number, a bold title and one supporting line. */
export function NumberedSteps({ steps, className }: NumberedStepsProps) {
  return (
    <View className={cn('gap-s2', className)}>
      {steps.map((step, index) => (
        <View
          key={step.title}
          className="flex-row items-start gap-s3 rounded-xl border border-border bg-surface p-s4"
        >
          <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-tint-orange">
            <Text className="text-label text-tint-orange-t" numeric>
              {index + 1}
            </Text>
          </View>
          <View className="flex-1 gap-s1">
            <Text className="text-label text-text">{step.title}</Text>
            {step.body ? <Text className="text-caption text-text-2">{step.body}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  )
}
