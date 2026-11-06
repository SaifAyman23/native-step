import { Pressable, Text, View } from 'react-native'

import { cn } from '@/lib/utils'
import { useThemeStore, type ThemeChoice } from '@/store/theme/themeStore'

const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function ModeToggle() {
  const choice = useThemeStore((state) => state.choice)
  const setChoice = useThemeStore((state) => state.setChoice)

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Appearance"
      className="flex-row self-start rounded-full bg-surface-3 p-1"
    >
      {OPTIONS.map((option) => {
        const active = option.value === choice
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${option.label} theme`}
            onPress={() => setChoice(option.value)}
            className={cn('rounded-full px-3.5 py-1.5', active && 'bg-surface shadow-sm')}
          >
            <Text
              className={cn(
                'text-xs',
                active
                  ? 'font-rubik-semibold text-text'
                  : 'text-text-2'
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
