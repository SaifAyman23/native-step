import type { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Txt as Text } from './Txt'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { useQootIcon } from './Icon'
import { IconButton } from './IconButton'
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon, DotsThreeVerticalIcon } from './icons'
import { CalendarSheet } from './CalendarSheet'
import { useOptionalSheet } from './SheetHost'

interface AppBarProps {
  /** Muted line above the headline, e.g. the date. */
  caption?: string
  /** Headline, e.g. `Hi, Sara`. */
  title: string
  /**
   * Trailing controls, laid out as one 4px row so a count-badge bell and a streak
   * sit side by side, instead of the caller nesting a row of its own.
   */
  trailing?: ReactNode
  className?: string
}

/** Screen-level header. It sits below the safe area, never under it. */
export function AppBar({ caption, title, trailing, className }: AppBarProps) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between gap-s3 border-border bg-bg px-s6 py-s4',
        className
      )}
    >
      <View className="flex-1">
        {caption ? <Text className="text-caption text-text-2">{caption}</Text> : null}
        <Text className={cn('text-4xl font-rubik-bold text-text', caption && 'mt-2')}>{title}</Text>
      </View>
      {trailing ? <View className="shrink-0 flex-row items-center gap-5">{trailing}</View> : null}
    </View>
  )
}

interface NavBarProps {
  title: string
  /** Muted line under the title, e.g. the AI call allowance. */
  subtitle?: string
  onBack?: () => void
  backLabel?: string
  /** Replaces the back arrow, e.g. a close button on a sheet route. */
  backIcon?: ReactElement
  trailing?: ReactElement
  /** Sub-navigation strip rendered under the title, e.g. a Segmented. */
  children?: ReactNode
  className?: string
}

/** Pushed-screen header: back, title, one trailing control. */
export function NavBar({
  title,
  subtitle,
  onBack,
  backLabel,
  backIcon,
  trailing,
  children,
  className,
}: NavBarProps) {
  const [t] = useTranslation()
  const back = useQootIcon('text', 20, 'bold')

  return (
    <View className={cn('border-b-[1.5px] border-border bg-bg px-s6 py-s4', className)}>
      <View className="flex-row items-center gap-s3">
        {backIcon ? (
          backIcon
        ) : onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backLabel ?? t('nav.back')}
            onPress={onBack}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center"
          >
            <CaretLeftIcon {...back} />
          </Pressable>
        ) : null}
        <View className="min-w-0 flex-1">
          <Text className="text-h3 font-rubik-bold text-text" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-caption text-text-2" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing ?? <View className="h-11 w-11" />}
      </View>
      {children ? <View className="mt-s3">{children}</View> : null}
    </View>
  )
}

interface DateNavProps {
  label: string
  onPrevious?: () => void
  onNext?: () => void
  /** Opens a picker, e.g. the calendar sheet. */
  onLabelPress?: () => void
  /**
   * Opens an options sheet, e.g. library / saved meals. Renders an ellipsis
   * options button on the trailing side.
   */
  onOptionsPress?: () => void
  /**
   * When given, the navigator owns a calendar: a button appears and the date
   * itself opens a month grid. The date is only applied when a day is tapped.
   */
  calendar?: {
    /** The date the grid opens on, `YYYY-MM-DD`. */
    value: string
    onChange: (date: string) => void
    /** The last day that can be picked. */
    maxDate?: string
  }
  previousDisabled?: boolean
  nextDisabled?: boolean
  className?: string
}

/** Day pager for the diary. Both arrows are always the same size. */
export function DateNav({
  label,
  onPrevious,
  onNext,
  onLabelPress,
  onOptionsPress,
  calendar,
  previousDisabled = false,
  nextDisabled = false,
  className,
}: DateNavProps) {
  const [t] = useTranslation()
  const caret = useQootIcon('text', 14, 'bold')
  const sheet = useOptionalSheet()

  const openCalendar = () => {
    if (!sheet || !calendar) return
    sheet.present(
      <CalendarSheet
        value={calendar.value}
        maxDate={calendar.maxDate}
        onChange={calendar.onChange}
        onClosed={sheet.dismiss}
      />
    )
  }

  return (
    <View className={cn('flex-row items-center justify-between gap-s3 bg-bg px-s6 py-s2', className)}>
      <IconButton
        icon={<CaretLeftIcon />}
        accessibilityLabel={t('nav.previousDay')}
        size="sm"
        onPress={onPrevious}
        disabled={previousDisabled}
        variant="ghost"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.dateLabel', { label })}
        onPress={calendar ? openCalendar : onLabelPress}
        disabled={!calendar && !onLabelPress}
        hitSlop={8}
        className="min-h-[44px] flex-row items-center gap-s2 px-s3"
      >
        <Text className="text-title font-rubik-bold text-text">{label}</Text>
        {calendar || onLabelPress ? <CaretDownIcon {...caret} /> : null}
      </Pressable>
      {/* {calendar ? (
        <IconButton
          icon={<CalendarBlankIcon />}
          accessibilityLabel="Pick a date"
          size="sm"
          variant="ghost"
          onPress={openCalendar}
        />
      ) : null} */}
      <IconButton
        icon={<CaretRightIcon />}
        accessibilityLabel={t('nav.nextDay')}
        size="sm"
        onPress={onNext}
        disabled={nextDisabled}
        variant="ghost"
      />
      {onOptionsPress ? (
        <IconButton
          icon={<DotsThreeVerticalIcon />}
          accessibilityLabel={t('nav.options')}
          size="sm"
          onPress={onOptionsPress}
          variant="ghost"
        />
      ) : null}
    </View>
  )
}
