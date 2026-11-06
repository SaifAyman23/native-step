import { useState, type ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { Avatar, type AvatarTone } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'
import { CaretDownIcon, PlusIcon, UsersThreeIcon } from './icons'
import { Txt as Text } from './Txt'
import { Glyph, useQootIcon } from './Icon'

export type AccountRole = 'client' | 'coach'

export interface AccountSwitcherAccount {
  id: string
  name: string
  email?: string
  role: AccountRole
  tone?: AvatarTone
  avatarUri?: string
  isCurrent?: boolean
}

export interface AccountSwitcherProps {
  accounts?: readonly AccountSwitcherAccount[]
  mainBody?: ReactNode
  emptyBody?: ReactNode
  innerBody?: ReactNode | ((context: { accounts: readonly AccountSwitcherAccount[] }) => ReactNode)
  renderAccount?: (account: AccountSwitcherAccount) => ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onAccountPress?: (account: AccountSwitcherAccount) => void
  onAddAnother?: () => void
  className?: string
}

/**
 * A flexible account switcher primitive.
 *
 * The main body stays visible in every state. The inner body is only
 * collapsible when at least one connected account exists.
 */
export function AccountSwitcher({
  accounts = [],
  mainBody,
  emptyBody,
  innerBody,
  renderAccount,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  onAccountPress,
  onAddAnother,
  className,
}: AccountSwitcherProps) {
  const { t } = useTranslation()
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded)

  const hasAccounts = accounts.length > 0
  const expanded = controlledExpanded ?? uncontrolledExpanded
  const icon = useQootIcon('primary-text', 18, 'bold')

  const setExpanded = (next: boolean) => {
    if (controlledExpanded == null) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  const defaultMainBody = (
    <View className="min-w-0 flex-1 gap-s1">
      <Text className="text-body font-rubik-bold text-text">
        {t('account.switcher.title')}
      </Text>
      <Text className="text-caption text-text-2">
        {hasAccounts
          ? t('account.switcher.useAnotherAccount')
          : t('account.switcher.noOtherAccounts')}
      </Text>
    </View>
  )

  const defaultEmptyBody = (
    <Text className="text-caption text-text-2">
      {t('account.switcher.addAnotherClientOrCoach')}
    </Text>
  )

  const addAnotherButton = (
    <Button
      title={t('account.switcher.addAnother')}
      variant="ghost"
      size="sm"
      icon={<PlusIcon />}
      onPress={onAddAnother}
      accessibilityLabel={t('account.switcher.addAnotherAccount')}
      containerClassName="self-start"
    />
  )

  const defaultAccount = (account: AccountSwitcherAccount) => {
    const roleLabel = t(`account.switcher.role.${account.role}`)

    const content = (
      <View className="flex-1 flex-row items-center gap-s3">
        <Avatar
          name={account.name}
          size="md"
          tone={account.tone}
          uri={account.avatarUri}
        />

        <View className="min-w-0 flex-1 gap-[2px]">
          <Text
            className="text-body font-rubik-semibold text-text"
            numberOfLines={1}
          >
            {account.name}
          </Text>

          <Text className="text-caption text-text-2" numberOfLines={1}>
            {account.email ?? t('account.switcher.connectedAccount')}
          </Text>
        </View>

        <Badge
          tone={account.role === 'coach' ? 'brand' : 'neutral'}
          label={roleLabel}
        />
      </View>
    )

    if (account.isCurrent || !onAccountPress) return content

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('account.switchTo', {
          name: account.name,
        })}
        accessibilityHint={t('account.switcher.switchesActiveAccount')}
        onPress={() => onAccountPress(account)}
        className="min-h-[52px] flex-1 justify-center rounded-lg active:bg-surface-2"
      >
        {content}
      </Pressable>
    )
  }

  return (
    <View
      className={cn(
        'gap-s3 rounded-xl border-2 border-border bg-surface p-s5',
        className,
      )}
    >
      <Pressable
        accessibilityRole={hasAccounts ? 'button' : undefined}
        accessibilityLabel={t('account.switcher.title')}
        accessibilityHint={
          hasAccounts
            ? expanded
              ? t('account.switcher.collapseConnectedAccounts')
              : t('account.switcher.showConnectedAccounts')
            : undefined
        }
        accessibilityState={hasAccounts ? { expanded } : undefined}
        disabled={!hasAccounts}
        onPress={() => setExpanded(!expanded)}
        className="min-h-[52px] flex-row items-center gap-s3 active:opacity-70"
      >
        <View className="h-10 w-10 items-center justify-center rounded-md bg-tint-orange">
          <Glyph icon={<UsersThreeIcon />} {...icon} />
        </View>

        {mainBody ?? defaultMainBody}

        {hasAccounts ? (
          <Animated.View
            className="h-10 w-10 items-center justify-center"
            style={{
              transform: [{ rotate: expanded ? '180deg' : '0deg' }],
            }}
          >
            <Glyph icon={<CaretDownIcon />} {...icon} />
          </Animated.View>
        ) : null}
      </Pressable>

      {!hasAccounts ? emptyBody ?? defaultEmptyBody : null}

      {!hasAccounts ? addAnotherButton : null}

      {hasAccounts && expanded ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          className="gap-s3"
        >
          {innerBody
            ? typeof innerBody === 'function'
              ? innerBody({ accounts })
              : innerBody
            : accounts.map((account) => (
                <View
                  key={account.id}
                  className="border-t-2 border-border pt-s3"
                >
                  {renderAccount
                    ? renderAccount(account)
                    : defaultAccount(account)}
                </View>
              ))}

          {addAnotherButton}
        </Animated.View>
      ) : null}
    </View>
  )
}

export default AccountSwitcher