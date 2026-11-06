import { forwardRef, useState } from 'react'
import { Pressable, TextInput, View, type TextInputInstance } from 'react-native'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { useThemeColors } from '@/theme'

import { useQootIcon } from './Icon'
import { MagnifyingGlassIcon, XIcon } from './icons'

interface SearchInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  onClear?: () => void
  autoFocus?: boolean
  className?: string
}

/** 48px search field. Quiet until it has focus, then it takes the primary border. */
export const SearchInput = forwardRef<TextInputInstance, SearchInputProps>(function SearchInput(
  { value, onChangeText, placeholder, onClear, autoFocus, className },
  ref
) {
  const [t] = useTranslation()
  const [focused, setFocused] = useState(false)
  const colors = useThemeColors()
  const glyph = useQootIcon('text-3', 18, 'bold')
  const clearGlyph = useQootIcon('text-3', 16, 'bold')

  return (
    <View
      className={cn(
        'h-12 w-full flex-row items-center gap-s3 rounded-lg border-2 px-s5',
        focused ? 'border-primary bg-surface' : 'border-transparent bg-surface-2',
        className
      )}
    >
      <MagnifyingGlassIcon {...glyph} />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? t('search.placeholder')}
        placeholderTextColor={colors['text-3']}
        selectionColor={colors.primary}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        underlineColorAndroid="transparent"
        className="min-h-0 flex-1 self-stretch bg-transparent p-0 text-sm font-rubik text-text"
        style={{
          paddingVertical: 0,
          margin: 0,
          textAlignVertical: 'center',
          includeFontPadding: false,
        }}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('search.clear')}
          onPress={onClear ?? (() => onChangeText(''))}
          hitSlop={10}
          className="h-11 w-11 items-center justify-center"
        >
          <XIcon {...clearGlyph} />
        </Pressable>
      ) : null}
    </View>
  )
})
