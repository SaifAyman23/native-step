import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTabBarBottomInset } from '@/components/shared/navigation/TabBarInsetContext'
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  ChoiceRow,
  DataChip,
  Fab,
  Field,
  Input,
  KeyValueList,
  ListRow,
  MicroList,
  ProgressBar,
  ProgressDots,
  Rows,
  Stack as StackComp,
  StatTile,
  Stepper,
  Switch,
  TextArea,
  Txt,
  WeekBars,
  WeekStrip,
} from '@/components/ui'
import { LightbulbIcon, PlusIcon } from '@/components/ui/icons'

function SectionHead({ title }: { title: string }) {
  return <Txt className="text-label font-rubik-semibold text-text">{title}</Txt>
}

export default function Examples() {
  const bottomInset = useTabBarBottomInset()

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: bottomInset }}>
        <View className="gap-5 pt-2">
          <AppBar caption="Dense but organized · general use" title="Examples" />

          <Card>
            <SectionHead title="Overview" />
            <View className="flex-row gap-3 pt-2">
              <StatTile label="Items" value="12" sub="of 24" tone="sky" className="flex-1" />
              <StatTile label="Tasks" value="76" sub="of 128" tone="green" className="flex-1" />
              <StatTile label="Alerts" value="3" sub="open" tone="yellow" className="flex-1" />
            </View>
            <ProgressBar label="Milestone" value={68} goal={100} />
            <ProgressDots total={5} value={3} />
          </Card>

          <Card>
            <SectionHead title="Lists & rows" />
            <Rows>
              <ListRow title="Report review" sub="Shared · 12:00 PM" onPress={() => {}} />
              <ListRow title="Design sync" sub="Team · 3:00 PM" value="45" valueUnit="min" onPress={() => {}} />
              <ListRow title="Publish queue" sub="3 items waiting" onPress={() => {}} />
            </Rows>
            <View className="pt-3">
              <KeyValueList items={[
                { label: 'Metric X', value: '24%' },
                { label: 'Metric Y', value: '8%' },
                { label: 'Metric Z', value: '8' },
              ]} />
            </View>
            <View className="pt-3">
              <MicroList items={[
                { label: 'Items open', value: '12' },
                { label: 'Items done', value: '24' },
              ]} variant="pill" />
            </View>
          </Card>

          <Card>
            <SectionHead title="Calendar" />
            <WeekStrip
              days={[
                { label: 'M', date: 2, percent: 80, isToday: true },
                { label: 'T', date: 3, percent: 45 },
                { label: 'W', date: 4, percent: 62 },
                { label: 'T', date: 5, percent: 95 },
                { label: 'F', date: 6, percent: 120 },
                { label: 'S', date: 7, percent: 0, isFuture: true },
                { label: 'S', date: 8, percent: 30, isFuture: true },
              ]}
            />
            <WeekBars days={[
              { label: 'Mon', state: 'on', percent: 80, isToday: true },
              { label: 'Tue', state: 'part', percent: 45 },
              { label: 'Wed', state: 'none', percent: 0 },
              { label: 'Thu', state: 'on', percent: 95 },
              { label: 'Fri', state: 'over', percent: 120 },
              { label: 'Sat', state: 'none', percent: 0 },
              { label: 'Sun', state: 'part', percent: 30 },
            ]} />
          </Card>

          <Card>
            <SectionHead title="Choices & chips" />
            <View className="flex-row flex-wrap gap-2 pt-2">
              <Chip label="Option A" selected onPress={() => {}} />
              <Chip label="Option B" onPress={() => {}} />
              <Chip label="Locked" locked onPress={() => {}} />
            </View>
            <View className="gap-2 pt-3">
              <ChoiceRow selected onSelect={() => {}} title="Default choice" sub="Always available" />
              <ChoiceRow selected={false} onSelect={() => {}} title="Alternative" sub="Pick to switch" />
            </View>
            <View className="flex-row gap-2 pt-3">
              <DataChip label="A" tone="p" value="76" onPress={() => {}} />
              <DataChip label="B" tone="c" value="45" onPress={() => {}} />
              <DataChip label="C" tone="f" value="12" onPress={() => {}} />
            </View>
            <View className="flex-row items-center gap-2 pt-3">
              <Avatar name="Alex" size="md" tone="green" />
              <Avatar name="Sam" size="md" tone="sky" />
              <Badge tone="brand" label="Active" />
              <Badge tone="neutral" label="Pending" />
            </View>
          </Card>

          <Card>
            <SectionHead title="Forms" />
            <View className="gap-3 pt-2">
              <SearchInputPlaceholder />
              <Field label="Name">
                <Input label="Name" value="" onChangeText={() => {}} placeholder="Full name" autoCapitalize="words" />
              </Field>
              <Stepper value={4} onChange={() => {}} min={0} max={12} step={1} unit="items" />
              <View className="flex-row items-center justify-between">
                <Txt className="text-caption text-text-2">Notifications</Txt>
                <Switch value={true} onValueChange={() => {}} accessibilityLabel="Notifications" />
              </View>
              <View className="flex-row items-center gap-2">
                <Checkbox checked onChange={() => {}} label="Agree" />
              </View>
              <TextArea label="Notes" value="" onChangeText={() => {}} placeholder="Write a note…" />
            </View>
          </Card>

          <Card>
            <SectionHead title="Actions" />
            <View className="flex-row flex-wrap gap-2 pt-2">
              <Button title="Primary" variant="primary" size="sm" onPress={() => {}} />
              <Button title="Secondary" variant="secondary" size="sm" onPress={() => {}} />
              <Button title="Ghost" variant="ghost" size="sm" onPress={() => {}} />
            </View>
            <View className="flex-row items-center justify-between pt-3">
              <Txt className="text-caption text-text-2">Floating action</Txt>
              <Fab icon={<PlusIcon />} accessibilityLabel="Add" onPress={() => {}} />
            </View>
            <View className="pt-2">
              <Alert tone="info" title="Tip" body="Use the components library tab to copy any primitive." />
            </View>
            <View className="pt-2">
              <Txt className="text-caption text-text-2">Stack container demo</Txt>
              <StackComp gap="sm">
                <Txt className="text-caption text-text-2">First item</Txt>
                <Txt className="text-caption text-text-2">Second item</Txt>
              </StackComp>
            </View>
            <View className="pt-2">
              <Txt className="text-caption text-text-2">Icon + illustration</Txt>
              <LightbulbIcon size={24} color="primary" />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function SearchInputPlaceholder() {
  return <Txt className="text-caption text-text-2">Search via the components library demos.</Txt>
}
