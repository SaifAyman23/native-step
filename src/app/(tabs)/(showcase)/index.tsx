import { Image, ScrollView, TouchableOpacity, View } from "react-native"

import { Label } from "@/components/ui/Label"
import { useTranslation } from "react-i18next"

import { Txt } from "@/components/ui/Txt"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Checkbox } from "@/components/ui/Checkbox"
import { Select } from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"
import { Badge } from "@/components/ui/Badge"
import { ProgressDots } from "@/components/ui/ProgressDots"

const Sections = () => {
  const { t } = useTranslation()

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="p-4">
        {/* Text Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.text')}</Txt>
          <Txt className="text-base text-text-2">{t('components.textDescription')}</Txt>
          <View className="grid grid-cols-2 gap-3">
            <Txt className="p-3 bg-surface-2 rounded-lg">{t('default')}</Txt>
            <Txt className="p-3 bg-surface-2 rounded-lg">{t('heading1')}</Txt>
            <Txt className="p-3 bg-surface-2 rounded-lg">{t('heading2')}</Txt>
            <Txt className="p-3 bg-surface-2 rounded-lg">{t('heading3')}</Txt>
          </View>
        </View>

        {/* Buttons Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.buttons')}</Txt>
          <View className="grid grid-cols-3 gap-3">
            <Button className="px-4 py-2" variant="primary">{t('primary')}</Button>
            <Button className="px-4 py-2" variant="secondary">{t('secondary')}</Button>
            <Button className="px-4 py-2" variant="ghost">{t('ghost')}</Button>
          </View>
        </View>

        {/* Cards Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.cards')}</Txt>
          <Card className="p-4">
            <Txt className="text-base text-text">{t('cardTitle')}</Txt>
            <Txt className="text-text-2 mt-2">{t('cardDescription')}</Txt>
          </Card>
          <Card className="p-4 bg-surface-2">
            <Txt className="text-base text-text">{t('cardTitle2')}</Txt>
            <Txt className="text-text-2 mt-2">{t('cardDescription2')}</Txt>
          </Card>
        </View>

        {/* Forms Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.forms')}</Txt>
          <Label text={t('name')} className="text-label font-rubik-bold mb-3 text-text"/>
          <Input
            value={t('sampleText')}
            onChangeText={() => {}}
            placeholder={t('namePlaceholder')}
            className="h-12"
          />
          <Label text={t('email')} className="text-label font-rubik-bold mb-3 text-text" mt-4/>
          <Input
            value={t('sampleText')}
            onChangeText={() => {}}
            placeholder={t('emailPlaceholder')}
            className="h-12"
          />
          <Checkbox checked={false} onChange={() => {}} label={t('terms')} className="mt-3"/>
          <Select
            value={t('option1')}
            onChange={() => {}}
            options={[
              { label: t('option1'), value: t('option1') },
              { label: t('option2'), value: t('option2') },
            ]}
            placeholder={t('selectPlaceholder')}
            className="mt-3"
          />
          <Switch
            value={true}
            onValueChange={() => {}}
            accessibilityLabel={t('toggle')}
            className="mt-3"
          />
        </View>

        {/* Progress Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.progress')}</Txt>
          <ProgressDots total={100} value={75} className="mb-3"/>
          <ProgressDots total={100} value={30} className="mb-3"/>
        </View>

        {/* Selection Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.selection')}</Txt>
          <Badge label={t('infoBadge')} tone="info" className="mb-2"/>
          <Badge label={t('warningBadge')} tone="warning" className="mb-2"/>
          <Badge label={t('errorBadge')} tone="error" className="mb-2"/>
        </View>

        {/* Lists Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.lists')}</Txt>
          <View className="grid grid-cols-2 gap-3">
            <View className="p-3 bg-surface-2 rounded-lg">
              <Txt className="font-medium text-text">{t('listItem1')}</Txt>
              <Txt className="text-text-2 mt-1">{t('listDesc1')}</Txt>
            </View>
            <View className="p-3 bg-surface-2 rounded-lg">
              <Txt className="font-medium text-text">{t('listItem2')}</Txt>
              <Txt className="text-text-2 mt-1">{t('listDesc2')}</Txt>
            </View>
          </View>
        </View>

        {/* Status & Empty Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.statusEmpty')}</Txt>
          <View className="p-6 bg-surface-2 rounded-lg text-center">
            <Txt className="text-text-2">{t('emptyState')}</Txt>
          </View>
        </View>

        {/* Actions Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.actions')}</Txt>
          <View className="grid grid-cols-4 gap-3">
            <TouchableOpacity className="p-3 bg-surface-2 rounded-lg">
              <Image source={require('@/assets/images/react-logo.png')} className="h-5 w-5"/>
              <Txt className="mt-1 text-text-2">{t('share')}</Txt>
            </TouchableOpacity>
            <TouchableOpacity className="p-3 bg-surface-2 rounded-lg">
              <Image source={require('@/assets/images/react-logo.png')} className="h-5 w-5"/>
              <Txt className="mt-1 text-text-2">{t('more')}</Txt>
            </TouchableOpacity>
          </View>
        </View>

        {/* Miscellaneous Section */}
        <View className="mb-6">
          <Txt className="text-xl font-semibold text-text mb-3">{t('components.misc')}</Txt>
          <View className="grid grid-cols-3 gap-3">
            <Badge label={t('chip1')} className="p-2 bg-surface-2 rounded"/>
            <Badge label={t('chip2')} className="p-2 bg-surface-2 rounded"/>
            <Badge label={t('chip3')} className="p-2 bg-surface-2 rounded"/>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default function Showcase() {
  return <Sections />
}