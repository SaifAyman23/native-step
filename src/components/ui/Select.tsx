import { Pressable, View } from 'react-native'

import { cn } from '@/lib/utils'
import { useThemeColors } from '@/theme'

import { Glyph, useQootIcon } from './Icon'
import { CaretDownIcon } from './icons'
import { SheetSurface } from './Sheet'
import { useSheet } from './SheetHost'
import { Txt as Text } from './Txt'

export interface SelectOption {
  label: string
  value: string
  sub?: string
  icon?: React.ReactElement
}

interface SelectProps {
  label?: string
  value?: string
  options: SelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * 56px field that presents the app's one sheet. Presentation state lives in
 * `SheetHost`, so reopening after a close is just setting it back to true.
 *
 * The option rows are a plain mapped list, not a `FlatList`: `SheetSurface`
 * already scrolls its children, and a virtualized list nested inside that
 * scroll view is an error in React Native.
 */
export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select',
  disabled = false,
  className,
}: SelectProps) {
  const host = useSheet()
  const colors = useThemeColors()
  const selected = options.find((option) => option.value === value)
  const caret = useQootIcon('text-3', 16, 'bold')
  const idleIcon = useQootIcon('text-2', 20, 'bold')
  const activeIcon = useQootIcon('primary-text', 20, 'bold')

  const present = () => {
    host.present(
      <SheetSurface onClosed={host.dismiss} title={label ?? 'Select'}>
        {options.length === 0 ? (
          <Text className="text-caption text-text-3">No options to choose from.</Text>
        ) : (
          <View className="gap-s2">
            {options.map((item) => {
              const active = item.value === value

              return (
                <Pressable
                  key={item.value}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={item.label}
                  onPress={() => {
                    onChange(item.value)
                    host.dismissAll()
                  }}
                  className={cn(
                    'min-h-[44px] flex-row items-center gap-s3 rounded-md px-s4 py-s3',
                    active ? 'bg-primary-tint' : 'bg-surface'
                  )}
                  style={({ pressed }) =>
                    pressed && !active ? { backgroundColor: colors['surface-2'] } : undefined
                  }
                >
                  {item.icon ? <Glyph icon={item.icon} {...(active ? activeIcon : idleIcon)} /> : null}
                  <View className="flex-1">
                    <Text className={cn('text-title', active ? 'text-primary-text' : 'text-text')}>
                      {item.label}
                    </Text>
                    {item.sub ? <Text className="text-caption text-text-3">{item.sub}</Text> : null}
                  </View>
                </Pressable>
              )
            })}
          </View>
        )}
      </SheetSurface>
    )
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, expanded: host.isPresented }}
      accessibilityLabel={`${label ?? placeholder}: ${selected?.label ?? placeholder}`}
      disabled={disabled}
      onPress={present}
      className={cn(
        'h-[56px] w-full flex-row items-center justify-between gap-s3 rounded-lg border-2 px-s7',
        disabled ? 'border-transparent bg-surface-3' : 'border-border-strong',
        className
      )}
    >
      <Text
        className={cn(
          'flex-1 text-base font-rubik-medium',
          disabled ? 'text-text-3' : selected ? 'text-text' : 'text-text-3'
        )}
      >
        {selected?.label ?? placeholder}
      </Text>
      <CaretDownIcon {...caret} />
    </Pressable>
  )
}
