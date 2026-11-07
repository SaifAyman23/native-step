import {
  Alert,
  AccountSwitcher,
  AppBar,
  Avatar,
  Badge,
  Button,
  Card,
  Check,
  Chip,
  ChipRow,
  ChoiceRow,
  CodeBox,
  DataChip,
  DateNav,
  DayDots,
  DragRow,
  EmptyHero,
  EmptyLine,
  Fab,
  FoodCard,
  HScroll,
  HeroCard,
  IconButton,
  Input,
  LimitGrid,
  ListRow,
  MacroBar,
  MealFooter,
  Meter,
  MetaRow,
  MicroList,
  NoteCard,
  Nudge,
  NumberedSteps,
  PermissionList,
  ProgressChart,
  ProgressDots,
  QootRing,
  RecipeCard,
  Rows,
  ScreenFooter,
  ScreenSkeleton,
  SearchInput,
  SectionLabel,
  Segmented,
  Select,
  SettingsGroup,
  ShareCode,
  SheetPicker,
  SheetSurface,
  Skeleton,
  Spinner,
  StatTile,
  StatusView,
  Stepper,
  StreakBadge,
  Switch,
  TabBar,
  Tabs,
  CalendarSheet,
  Checkbox,
  DateField,
  Field,
  InputOTP,
  Label,
  Stack,
  TextArea,
  Toast,
  Txt,
  UsageMeter,
  WaterCard,
  WeekBars,
  WeekStrip,
  useSheet,
} from "@/components/ui";
import { AppText as Text } from "@/components/ui/AppText";
import {
  BarcodeIcon,
  BellIcon,
  BookOpenIcon,
  BowlFoodIcon,
  CakeIcon,
  CameraIcon,
  ChartLineUpIcon,
  ChatCircleSlashIcon,
  CheckCircleIcon,
  ClockIcon,
  CookieIcon,
  DropIcon,
  EggIcon,
  EyeIcon,
  ForkKnifeIcon,
  GearIcon,
  HeartIcon,
  HeartbeatIcon,
  HouseIcon,
  LinkSimpleBreakIcon,
  LinkSimpleIcon,
  LockSimpleIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PaletteIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  PencilSlashIcon,
  PlusIcon,
  TranslateIcon,
  UserIcon,
  UsersThreeIcon,
  WarningIcon,
} from "@/components/ui/icons";
import { useThemeStore } from "@/store/theme/themeStore";
import { useRef, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

// Local Rapido lockup — QootLockup equivalent using Rapido assets/wordmark.
type RapidoTone = "plain" | "onPrimary";
function RapidoMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={{ width: size, height: size }}
      contentFit="contain"
      accessibilityLabel="Rapido"
    />
  );
}
function RapidoLockup({
  size = 32,
  tone = "plain",
  mark = true,
  className,
}: {
  size?: number;
  tone?: RapidoTone;
  mark?: boolean;
  className?: string;
}) {
  const wordSize = Math.round(size * 0.62);
  const tones: Record<RapidoTone, string> = {
    plain: "text-text",
    onPrimary: "text-on-primary",
  };
  return (
    <View
      accessibilityLabel="Rapido"
      className={className}
      style={{ flexDirection: "row", alignItems: "center", gap: size * 0.3 }}
    >
      {mark ? <RapidoMark size={size} /> : null}
      <Text
        className={`${tones[tone]} font-rubik-extrabold`}
        style={{
          fontSize: wordSize,
          lineHeight: Math.round(wordSize * 1.05),
          letterSpacing: -wordSize * 0.025,
        }}
      >
        Rapido
      </Text>
    </View>
  );
}
const QootLockup = RapidoLockup;

const MEALS = [
  { value: "breakfast", label: "Breakfast", icon: <EggIcon /> },
  { value: "lunch", label: "Lunch", icon: <BowlFoodIcon /> },
  { value: "dinner", label: "Dinner", icon: <ForkKnifeIcon /> },
  { value: "snacks", label: "Snacks", icon: <CookieIcon /> },
];

const ALLERGIES = [
  { value: "peanut", label: "Peanut", sub: "Peanuts and groundnuts" },
  { value: "nuts", label: "Nuts", sub: "Cashews, almonds, walnuts" },
  { value: "dairy", label: "Dairy", sub: "Milk, cheese, yoghurt" },
  { value: "gluten", label: "Gluten", sub: "Wheat, barley, rye" },
  { value: "eggs", label: "Eggs" },
  { value: "fish", label: "Fish", sub: "Salmon, tuna, sardines" },
  { value: "shellfish", label: "Shellfish" },
  { value: "soy", label: "Soy" },
  { value: "sesame", label: "Sesame" },
  { value: "celery", label: "Celery" },
];

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-s4">
      <View className="gap-s2">
        <Text variant="h2">{title}</Text>
        {note ? (
          <Text variant="body" className="text-text-2">
            {note}
          </Text>
        ) : null}
      </View>
      <View className="gap-s4">{children}</View>
    </View>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-s3">
      <SectionLabel>{label}</SectionLabel>
      <View className="gap-s3">{children}</View>
    </View>
  );
}

export default function GalleryScreen() {
  const { width } = useWindowDimensions();
  const choice = useThemeStore((state) => state.choice);
  const setChoice = useThemeStore((state) => state.setChoice);

  const [switchOn, setSwitchOn] = useState(true);
  const [switchOff, setSwitchOff] = useState(false);
  const [checked, setChecked] = useState(true);
  const [unchecked, setUnchecked] = useState(false);
  const [radio, setRadio] = useState("lose");
  const [hold, setHold] = useState(false);
  const [diet, setDiet] = useState("balanced");
  const [single, setSingle] = useState<string[]>(["all"]);
  const [allergies, setAllergies] = useState<string[]>(["peanut"]);
  const [edu, setEdu] = useState<string[]>([]);
  const [range, setRange] = useState("metric");
  const [grain, setGrain] = useState("week");
  const [diarySection, setDiarySection] = useState("meals");
  const [tab, setTab] = useState("today");
  const [weight, setWeight] = useState("72");
  const [email, setEmail] = useState("sara@example.com");
  const [name, setName] = useState("Sara");
  const [query, setQuery] = useState("kosh");
  const [meal, setMeal] = useState("breakfast");
  const [note, setNote] = useState("");
  const [water, setWater] = useState(5);
  const [cupInput, setCupInput] = useState("4191");
  const [step, setStep] = useState(1);
  const [noticeFavorite, setNoticeFavorite] = useState(false);
  const [segmentDay, setSegmentDay] = useState<string[]>(["today"]);
  const [toastOpen, setToastOpen] = useState(false);
  const [picker, setPicker] = useState("breakfast");
  const galleryDate = new Date().toISOString().slice(0, 10);
  const [otp, setOtp] = useState("");
  const [dateValue, setDateValue] = useState(galleryDate);
  const [boxChecked, setBoxChecked] = useState(false);
  const [realToast, setRealToast] = useState(false);
  const host = useSheet();

  const presentCalendar = () =>
    host.present(
      <CalendarSheet
        value={dateValue}
        maxDate={galleryDate}
        onChange={setDateValue}
        onClosed={host.dismiss}
      />,
    );

  // ...inside your screen component
  const nextId = useRef(3);
  const [dragRows, setDragRows] = useState([
    { id: "row-0", title: "Foul medames", kcal: "230" },
    { id: "row-1", title: "Koshari", kcal: "350" },
    { id: "row-2", title: "Ta'ameya", kcal: "180" },
  ]);

  const addRow = () =>
    setDragRows((list) => [
      ...list,
      {
        id: `row-${nextId.current}`,
        title: `Foul medames ${nextId.current++}`,
        kcal: "230",
      },
    ]);

  const removeRow = (id: string) =>
    setDragRows((list) => list.filter((item) => item.id !== id));

  // SheetPicker owns a draft internally since the host can't re-render a
  // presented node — inline presentation is enough, no wrapper components.
  const presentPicker = () =>
    host.present(
      <SheetSurface
        onClosed={host.dismiss}
        title="Add to"
        footer={<Button title="Add 3 items" block onPress={host.dismissAll} />}
      >
        <SheetPicker value={picker} onChange={setPicker} options={MEALS} />
      </SheetSurface>,
    );

  const presentMultiPicker = () =>
    host.present(
      <SheetSurface onClosed={host.dismiss} title="Allergies">
        <SheetPicker
          multiple
          value={allergies}
          onChange={setAllergies}
          onConfirm={host.dismissAll}
          options={ALLERGIES}
        />
      </SheetSurface>,
    );

  const presentNotice = () =>
    host.present(
      <SheetSurface
        onClosed={host.dismiss}
        title="Activity"
        sectionLabel="Done today"
        titleAccessory={
          <IconButton
            icon={<HeartIcon />}
            iconWeight={noticeFavorite ? "fill" : "regular"}
            variant="ghost"
            accessibilityLabel="Favorite activity"
            onPress={() => setNoticeFavorite((value) => !value)}
          />
        }
      >
        <ChipRow
          exclusive
          options={[
            { value: "walk", label: "Walking, 4 km/h" },
            { value: "run", label: "Running, 9 km/h" },
          ]}
          selected={segmentDay}
          onChange={setSegmentDay}
        />
        <Input
          label="Duration"
          unit="min"
          value="30"
          onChangeText={() => {}}
          keyboardType="number-pad"
        />
        <Input
          label="Distance"
          unit="km"
          value="2.4"
          onChangeText={() => {}}
          keyboardType="decimal-pad"
        />
      </SheetSurface>,
    );

  const [dayIndex, setDayIndex] = useState(3);

  const pad = width > 480 ? 40 : 20;

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ padding: pad, paddingBottom: 140, gap: 40 }}
      >
        <View className="gap-s3">
          <QootLockup size={34} />
          <Text variant="display">Component contract</Text>
          <Text variant="body" className="text-text-2">
            Every primitive from the design system, in every state it has. If a
            screen needs something that is not here, that is a bug in the
            screen, not a gap here.
          </Text>
          <Segmented
            block
            value={choice}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
            onChange={setChoice}
            accessibilityLabel="Theme"
          />
        </View>

        {/* -------------------------------------------------------- typography */}
        <Section
          title="Typography"
          note="Rubik 400 to 800, one family for Latin and Arabic. Metrics use tabular figures. No second family."
        >
          <Card>
            <View className="gap-s5">
              {(
                [
                  ["display 36/42 800", "Eat well, feel good", "display"],
                  ["h1 28/34 700", "Lunch logged", "h1"],
                  ["h2 22/28 700", "Today", "h2"],
                  ["h3 18/24 600", "Breakfast", "h3"],
                  ["title 16/22 600", "Foul, eggs, baladi bread", "title"],
                  [
                    "body 14/20 400",
                    "Foul, koshary, molokhia, mahshi.",
                    "body",
                  ],
                  ["caption 12/16 500", "Partial data", "caption"],
                  ["label 12/16 600", "Serving", "label"],
                  ["metric-xl 48/52 700", "680", "metricXl"],
                  ["metric-lg 32/36 700", "1,020", "metricLg"],
                  ["metric-md 22/28 600", "640", "metricMd"],
                ] as const
              ).map(([spec, sample, variant]) => (
                <View key={variant} className="gap-s1">
                  <Txt className="text-caption text-text-2">{spec}</Txt>
                  <Text variant={variant}>{sample}</Text>
                </View>
              ))}
              <View className="gap-s1">
                <Txt className="text-caption text-text-2">
                  Arabic, same family, about 10% more line height
                </Txt>
                <Text variant="h1" script="ar">
                  سجّل وجبتك
                </Text>
              </View>
              <View className="gap-s1">
                <Txt className="text-caption text-text-2">
                  Day group label, uppercase
                </Txt>
                <SectionLabel variant="day">Sat 10 Oct</SectionLabel>
              </View>
            </View>
          </Card>
        </Section>

        {/* ----------------------------------------------------------- buttons */}
        <Section
          title="Buttons"
          note="The press edge is a border-bottom, never a box shadow. On press the button sinks and the edge collapses. Text on a primary button is dark brown, never white."
        >
          <Group label="Variants">
            <Button title="Log meal" onPress={() => {}} variant="primary" />
            <Button title="Save goal" onPress={() => {}} variant="green" />
            <Button
              title="Maybe later"
              onPress={() => {}}
              variant="secondary"
            />
            <Button title="Edit" onPress={() => {}} variant="tonal" />
            <Button title="Skip" onPress={() => {}} variant="ghost" />
            <Button title="Delete log" onPress={() => {}} variant="danger" />
          </Group>

          <Group label="Disabled, the edge follows the face">
            <Button
              title="Log meal"
              onPress={() => {}}
              variant="primary"
              disabled
            />
            <Button
              title="Save goal"
              onPress={() => {}}
              variant="green"
              disabled
            />
            <Button
              title="Maybe later"
              onPress={() => {}}
              variant="secondary"
              disabled
            />
            <Button
              title="Delete log"
              onPress={() => {}}
              variant="danger"
              disabled
            />
          </Group>

          <Group label="Sizes">
            <Button
              title="Small"
              size="sm"
              variant="primary"
              onPress={() => {}}
            />
            <Button title="Default 52" variant="primary" onPress={() => {}} />
            <Button
              title="Large 60, full width"
              size="lg"
              variant="primary"
              block
              onPress={() => {}}
            />
          </Group>

          <Group label="With a glyph">
            <Button
              title="Add food"
              icon={<PlusIcon />}
              variant="primary"
              onPress={() => {}}
            />
            <Button
              title="Edit"
              icon={<PencilSimpleIcon />}
              variant="tonal"
              onPress={() => {}}
            />
            <Button
              title="Scan"
              icon={<BarcodeIcon />}
              variant="secondary"
              onPress={() => {}}
            />
          </Group>

          <Group label="Loading">
            <Button
              title="Saving"
              variant="primary"
              loading
              onPress={() => {}}
            />
            <Button
              title="Saving"
              variant="secondary"
              loading
              onPress={() => {}}
            />
            <Spinner size={18} />
            <Spinner size={28} color="primary-text" />
          </Group>

          <View className="flex-row flex-wrap items-center gap-s3">
            <IconButton
              icon={<MagnifyingGlassIcon />}
              accessibilityLabel="Search"
              onPress={() => {}}
            />
            <IconButton
              icon={<GearIcon />}
              accessibilityLabel="Settings"
              onPress={() => {}}
              variant="ghost"
            />
            <IconButton
              icon={<MicrophoneIcon />}
              iconTone="primary-text"
              accessibilityLabel="Speak instead"
              variant="ghost"
              className="rounded-full bg-primary-tint"
              onPress={() => {}}
            />
            <IconButton
              icon={<BellIcon />}
              accessibilityLabel="Notifications"
              count={3}
              onPress={() => {}}
            />
            <IconButton
              icon={<LockSimpleIcon />}
              accessibilityLabel="Locked"
              onPress={() => {}}
              disabled
            />
            <Fab
              icon={<PlusIcon />}
              className="w-12"
              accessibilityLabel="Log something"
              onPress={() => {}}
            />
          </View>
        </Section>

        {/* ------------------------------------------------------------ inputs */}
        <Section
          title="Inputs"
          note="Label above, help below, error below that. Never a placeholder as a label. A unit sits inside the input at the trailing edge, sized to its own text."
        >
          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Sara"
          />
          <Input
            label="Weight"
            unit="kg"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            help="You can change units later in Profile."
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error="That email is already in use."
          />
          <Input
            label="Disabled"
            value="Set up after onboarding"
            onChangeText={() => {}}
            disabled
          />
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a food"
          />
          <TextArea
            label="Note"
            value={note}
            onChangeText={setNote}
            placeholder="Write something short and kind"
            hint="One way. They cannot reply here."
            maxLength={500}
          />
          <Select
            label="Meal"
            value={meal}
            onChange={setMeal}
            options={[
              { label: "Breakfast", value: "breakfast" },
              { label: "Lunch", value: "lunch" },
              { label: "Dinner", value: "dinner" },
              { label: "Snacks", value: "snacks" },
            ]}
          />
          <Select
            label="Disabled"
            value=""
            onChange={() => {}}
            options={[]}
            disabled
          />
        </Section>

        {/* --------------------------------------------------------- selection */}
        <Section title="Selection">
          <Group label="Segmented">
            <Segmented
              value={range}
              options={[
                { value: "metric", label: "Metric" },
                { value: "imperial", label: "Imperial" },
              ]}
              onChange={setRange}
            />
            <Segmented
              block
              value={grain}
              options={[
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
              ]}
              onChange={setGrain}
            />
          </Group>

          <Group label="Sub-navigation strip, pinned under a nav bar">
            <View className="w-full self-stretch">
              <Segmented
                subnav
                value={diarySection}
                options={[
                  { value: "meals", label: "Meals" },
                  { value: "foods", label: "Foods" },
                  { value: "recipes", label: "Recipes" },
                ]}
                onChange={setDiarySection}
              />
            </View>
            <View className="w-full self-stretch">
              <Tabs
                value={diarySection}
                options={[
                  { value: "meals", label: "Meals" },
                  { value: "foods", label: "Foods" },
                  { value: "recipes", label: "Recipes" },
                ]}
                onChange={setDiarySection}
                accessibilityLabel="Diary section"
              />
            </View>
          </Group>

          <Group label="Switch, checkbox, radio">
            <Switch
              accessibilityLabel="Meal reminder"
              value={switchOn}
              onValueChange={setSwitchOn}
            />
            <Switch
              accessibilityLabel="Custom reminder"
              value={switchOff}
              onValueChange={setSwitchOff}
            />
            <Switch
              accessibilityLabel="Locked"
              value
              disabled
              onValueChange={() => {}}
            />
            <Check
              accessibilityLabel="Peanuts"
              checked={checked}
              onChange={setChecked}
            />
            <Check
              accessibilityLabel="Sesame"
              checked={unchecked}
              onChange={setUnchecked}
            />
            <Check
              accessibilityLabel="Lose weight"
              tone="round"
              checked={radio === "lose"}
              onChange={() => setRadio("lose")}
            />
            <Check
              accessibilityLabel="Maintain"
              tone="round"
              checked={radio === "maintain"}
              onChange={() => setRadio("maintain")}
            />
            <Check
              accessibilityLabel="Small radio"
              tone="round"
              size={22}
              checked={hold}
              onChange={setHold}
            />
          </Group>

          <Rows>
            {(["Balanced", "Vegetarian", "Vegan"] as const).map(
              (label, index) => (
                <ChoiceRow
                  key={label}
                  selected={diet === ["balanced", "vegetarian", "vegan"][index]}
                  onSelect={() =>
                    setDiet(["balanced", "vegetarian", "vegan"][index])
                  }
                  title={label}
                  sub={
                    [
                      "Everything in normal portions",
                      "No meat or fish",
                      "No animal products",
                    ][index]
                  }
                />
              ),
            )}
          </Rows>

          <Group label="Card choices">
            <ChoiceRow
              card
              selected={diet === "balanced"}
              onSelect={() => setDiet("balanced")}
              title="Selected card"
              titleClassName="text-lg"
              sub="Onboarding choice with a full border and tint"
            />
            <ChoiceRow
              card
              selected={diet === "vegan"}
              onSelect={() => setDiet("vegan")}
              title="Unselected card"
              titleClassName="text-lg"
              sub="Same control, resting surface"
            />
          </Group>
        </Section>

        {/* --------------------------------------------------- chips and badges */}
        <Section
          title="Chips and badges"
          note="Chips are also the component for every static reference list, so allergies and diet options never become a row-per-item list with hairlines."
        >
          <Group label="Single-select filter row">
            <ChipRow
              exclusive
              options={[
                { value: "all", label: "All" },
                { value: "foul", label: "Foul" },
                { value: "koshary", label: "Koshary" },
                { value: "molokhia", label: "Molokhia" },
                { value: "mahshi", label: "Mahshi" },
              ]}
              selected={single}
              onChange={setSingle}
            />
          </Group>

          <Group label="Multi-select, allergies">
            <ChipRow
              options={[
                { value: "peanut", label: "Peanut" },
                { value: "celery", label: "Celery" },
                { value: "nuts", label: "Nuts" },
                { value: "dairy", label: "Dairy" },
                { value: "gluten", label: "Gluten" },
                { value: "shellfish", label: "Shellfish" },
                { value: "eggs", label: "Eggs" },
                { value: "soy", label: "Soy" },
                { value: "sesame", label: "Sesame" },
                { value: "none", label: "None" },
              ]}
              selected={allergies}
              onChange={setAllergies}
            />
          </Group>

          <Group label="Horizontal scroll, onboarding education">
            <ChipRow
              scroll
              options={[
                { value: "protein", label: "What protein does" },
                { value: "carbs", label: "What carbs do" },
                { value: "fat", label: "What fat does" },
              ]}
              selected={edu}
              onChange={setEdu}
            />
          </Group>

          <Group label="Badges">
            <Badge label="Pro" tone="brand" />
            <Badge label="Logged" tone="success" />
            <Badge label="Almost at limit" tone="warning" />
            <Badge label="Failed" tone="error" />
            <Badge label="Tip" tone="info" />
            <Badge label="V3.0" tone="locked" />
            <StreakBadge days={12} />
            <Chip label="Favorites, soon" locked />
          </Group>
        </Section>

        {/* -------------------------------------------------- cards and tiles */}
        <Section
          title="Cards and tiles"
          note="A card is only used where it is a real surface. At most two cards sit above the fold on any screen."
        >
          <HeroCard
            kcal={680}
            goal={1700}
            macros={[
              { label: "Protein", value: 76, goal: 128, tone: "p" },
              { label: "Carbs", value: 110, goal: 191, tone: "c" },
              { label: "Fat", value: 30, goal: 47, tone: "f" },
            ]}
          />
          <Badge label="one per screen" tone="brand" className="flex-start" />
          <View className="flex-row flex-wrap gap-s3">
            <View className="w-[48%]">
              <StatTile
                label="Eaten"
                value="1,020"
                sub="of 1,700 kcal"
                tone="orange"
              />
            </View>

            <View className="w-[48%]">
              <StatTile
                label="Protein"
                value="76 g"
                sub="of 128 g"
                tone="green"
              />
            </View>

            <View className="w-[48%]">
              <StatTile
                label="Water"
                value="1,250"
                sub="of 2,000 ml"
                tone="yellow"
                icon={<DropIcon />}
              />
            </View>

            <View className="w-[48%]">
              <StatTile label="Steps" value="1,240" sub="today" tone="sky" />
            </View>

            <View className="w-[48%]">
              <StatTile label="Streak" value="12" sub="days" tone="berry" />
            </View>
          </View>
        </Section>

        {/* -------------------------------------------------------- list rows */}
        <Section
          title="List rows and food rows"
          note="One divider direction, first row has none. A food row shows the calories at the end with three macro labels beside it. There is no separator string."
        >
          <Rows>
            <ListRow
              icon={<EggIcon />}
              iconTone="orange"
              title="Foul medames"
              sub="1 plate, about 250 g"
              macros={{ protein: 14, carbs: 31, fat: 8 }}
              value="230"
              valueUnit="kcal"
            />
            <ListRow
              icon={<BowlFoodIcon />}
              iconTone="green"
              title="Salata"
              sub="1 plate"
              macros={{ protein: 3, carbs: 9, fat: 3 }}
              value="70"
              valueUnit="kcal"
            />
            <ListRow
              icon={<ForkKnifeIcon />}
              iconTone="yellow"
              title="Eish baladi"
              sub="1 loaf"
              macros={{ protein: 6, carbs: 31, fat: 2 }}
              value="150"
              valueUnit="kcal"
            />
          </Rows>

          <Rows className="w-full">
            <ListRow
              icon={<BellIcon />}
              iconTone="sky"
              title="Breakfast reminder"
              sub="Every day at 08:00"
              className="w-full"
              trailing={
                <Switch
                  accessibilityLabel="Breakfast reminder"
                  value={switchOn}
                  onValueChange={setSwitchOn}
                />
              }
            />
            <ListRow
              icon={<UserIcon />}
              iconTone="orange"
              title="Appearance"
              value="Light"
              navigate
              onPress={() => {}}
            />
            <ListRow
              icon={<CakeIcon />}
              iconTone="yellow"
              title="Koshary"
              sub="Saved on this device, waiting to sync"
              pending
            />
            <ListRow
              title="Plain icon, no tile"
              sub="Activity and other symbol-led rows"
              icon={<HeartbeatIcon />}
              iconPlain
              onPress={() => {}}
            />
          </Rows>

          <MealFooter
            className="w-full"
            kcal={640}
            protein={26}
            carbs={93}
            fat={29}
          />
        </Section>

        {/* -------------------------------------------------------- data chips */}
        <Section
          title="Data chips"
          note="Nutrition colors belong to data only, never to a button or a status. They carry no press edge."
        >
          <Group label="Macros">
            <DataChip tone="p" label="Protein" value="128 g" />
            <DataChip tone="c" label="Carbs" value="191 g" />
            <DataChip tone="f" label="Fat" value="47 g" />
            <DataChip tone="w" label="Water" value="2,000 ml" />
          </Group>
        </Section>

        {/* ------------------------------------------------------- macro bars */}
        <Section
          title="Macro bars"
          note="Track is 8px, radius full. The fill color alone carries the macro, so the label stays neutral and no swatch is needed."
        >
          <Card>
            <View className="gap-s3">
              <MacroBar label="Protein" value={76} goal={128} tone="p" />
              <MacroBar label="Carbs" value={110} goal={191} tone="c" />
              <MacroBar label="Fat" value={30} goal={47} tone="f" />
              <MacroBar
                label="Water"
                value={5}
                goal={8}
                tone="w"
                format={(value, goal) => `${value} / ${goal} cups`}
              />
            </View>
          </Card>
        </Section>

        {/* --------------------------------------------------- micronutrients */}
        <Section
          title="Micronutrients"
          note="Plain rows split by a hairline in food sheets. Pill rows carry their own surface and border on meal details."
        >
          <Group label="Plain">
            <MicroList
              items={[
                { label: "Iron", value: "42%" },
                { label: "Calcium", value: "18%" },
                { label: "Fibre", value: "11 g" },
                { label: "Sodium", value: "1,180 mg" },
              ]}
            />
          </Group>
          <Group label="Pill">
            <MicroList
              variant="pill"
              items={[
                { label: "Iron", value: "42%" },
                { label: "Calcium", value: "18%" },
                { label: "Fibre", value: "11 g" },
                { label: "Sodium", value: "1,180 mg" },
              ]}
            />
          </Group>
        </Section>

        {/* ------------------------------------------------------- water cups */}
        <Section
          title="Water card"
          note="The Today water card: label and volume on one line, the cups below. Tap an empty cup to add, tap a filled one to undo back to it."
        >
          <WaterCard
            filled={water}
            onChange={setWater}
            caption={`${(water * 250).toLocaleString("en-US")} of 2,000 ml`}
          />
        </Section>

        {/* -------------------------------------------------------- week strip */}
        <Section
          title="Week strip"
          note="The user's real week, Saturday to Friday. Today is always inside the range and the strip never shifts to start on Monday."
        >
          <Card>
            <WeekStrip
              days={[
                { label: "Sat", date: 10, percent: 72 },
                { label: "Sun", date: 11, percent: 88 },
                { label: "Mon", date: 12, percent: 64 },
                { label: "Tue", date: 13, percent: 41, isToday: true },
                { label: "Wed", date: 14, percent: null, isFuture: true },
                { label: "Thu", date: 15, percent: null, isFuture: true },
                { label: "Fri", date: 16, percent: null, isFuture: true },
              ]}
              selectedIndex={dayIndex}
              onSelect={setDayIndex}
            />
            <Txt className="mt-s4 text-caption text-text-2">
              Tuesday, 13 Oct. Today sits fourth, three past days then three
              future days.
            </Txt>
          </Card>
        </Section>

        {/* -------------------------------------------------------------- ring */}
        <Section
          title="The Qoot ring"
          note="The day splits into three even 120 degree sections clockwise from twelve o'clock: protein, carbs, fat. Each section is its own loader, a track for the whole target and a coloured fill for the part eaten."
        >
          <Card>
            <View className="items-center gap-s6 py-s4">
              <QootRing
                size="hero"
                protein={59}
                carbs={58}
                fat={64}
                value="680"
                caption="/1,700 kcals"
              />
              <View className="flex-row items-center gap-s6">
                <QootRing
                  size="medium"
                  protein={100}
                  carbs={100}
                  fat={100}
                  value="2,100"
                  caption="kcal, goal hit"
                />
                <QootRing
                  size="small"
                  protein={59}
                  carbs={58}
                  fat={64}
                  value="680"
                  caption="/1,700 kcals"
                />
              </View>
            </View>
          </Card>
        </Section>

        {/* ------------------------------------------------ avatar and lockup */}
        <Section title="Avatar and logo lockup">
          <Group label="Sizes and tints">
            <View className="flex-row flex-wrap items-center gap-s3">
              <Avatar name="Sara" tone="orange" status="ok" />
              <Avatar name="Nour" tone="berry" status="warn" />
              <Avatar name="Omar" tone="green" status="ok" />
              <Avatar name="Hassan" tone="sky" status="warn" />
            </View>
            <View className="flex-row flex-wrap items-end gap-s3">
              <Avatar name="Sara" size="lg" tone="orange" status="ok" />
              <Avatar name="Nour" size="xl" tone="berry" status="warn" />
              <Avatar name="Omar" size="2xl" tone="green" />
            </View>
          </Group>
          <Group label="Logo lockup">
            <QootLockup size={30} />
            <View className="rounded-lg bg-primary px-s5 py-s3">
              <QootLockup size={30} tone="onPrimary" />
            </View>
          </Group>
        </Section>

        <Section
          title="Account switcher"
          note="Flexible main and inner bodies; the inner account list collapses when accounts exist."
        >
          <AccountSwitcher
            accounts={[
              {
                id: "gallery-client",
                name: "Sara Mahmoud",
                email: "sara@example.com",
                role: "client",
                tone: "orange",
                isCurrent: true,
              },
              {
                id: "gallery-coach",
                name: "Karim Haddad",
                email: "karim@example.com",
                role: "coach",
                tone: "sky",
              },
            ]}
          />
          <AccountSwitcher />
        </Section>

        {/* ---------------------------------------------------------- feedback */}
        <Section title="Feedback">
          <Group label="Toast, with a five second Undo">
            <Button
              title="Show toast"
              variant="secondary"
              onPress={() => setToastOpen(true)}
            />
            {toastOpen ? (
              <View className="rounded-lg bg-inverse px-s5 py-s4">
                <Txt className="text-sm font-rubik-semibold leading-[19px] text-on-inverse">
                  Lunch logged. 640 kcal added. 320 to go.
                </Txt>
                <Txt
                  className="mt-s3 self-end text-sm font-rubik-bold text-toast-action"
                  onPress={() => setToastOpen(false)}
                >
                  Undo
                </Txt>
              </View>
            ) : null}
          </Group>

          <Group label="Alerts">
            <Alert
              tone="ok"
              title="Nice work"
              body="Lunch logged. 640 kcal added."
            />
            <Alert
              tone="warn"
              title="Heads up"
              body="Almost at salt limit. 300 mg left."
            />
            <Alert
              tone="info"
              title="Good to know"
              body="Add the portion in grams for a closer number."
            />
            <Alert
              tone="error"
              title="Could not save"
              body="Check your connection and try again."
            />
            <Alert
              tone="warn"
              body="Body only when the sentence carries the whole message. No title row."
            />
          </Group>

          <Group label="Nudge tile, one per screen">
            <Nudge
              title="3 more cups of water"
              body="You are at 5 of 8 today."
              icon={<DropIcon />}
            />
            <Nudge
              title="Low on protein today"
              body="Two eggs at breakfast would close it."
            />
          </Group>
        </Section>

        {/* ------------------------------------------------------- StatusView */}
        <Section
          title="StatusView, all four states"
          note="One component renders every data screen's four states. Loading is a skeleton matching the screen's shape, never a bare spinner."
        >
          <Card>
            <Txt className="text-label font-rubik-semibold text-text-2">
              Loading
            </Txt>
            <View className="mt-s3 gap-s3">
              <Skeleton variant="thick" />
              <Skeleton variant="line" width="80%" />
              <Skeleton variant="line" width="60%" />
              <Skeleton variant="block" />
            </View>
          </Card>
          <Card>
            <Txt className="text-label font-rubik-semibold text-text-2">
              Screen shapes
            </Txt>
            <View className="mt-s4 gap-s6">
              <View className="gap-s2">
                <Txt className="text-caption text-text-3">Dashboard</Txt>
                <ScreenSkeleton variant="dashboard" />
              </View>
              <View className="gap-s2">
                <Txt className="text-caption text-text-3">List</Txt>
                <ScreenSkeleton variant="list" />
              </View>
              <View className="gap-s2">
                <Txt className="text-caption text-text-3">Profile</Txt>
                <ScreenSkeleton variant="profile" />
              </View>
              <View className="gap-s2">
                <Txt className="text-caption text-text-3">Grid</Txt>
                <ScreenSkeleton variant="grid" />
              </View>
            </View>
          </Card>
          <Card>
            <StatusView
              state="empty"
              emptyTitle="Nothing logged yet"
              emptyBody="Add your first meal and your targets fill in here."
              emptyActionLabel="Log your first meal"
              onEmptyAction={() => {}}
            />
          </Card>
          <Card>
            <StatusView
              state="error"
              emptyTitle="Could not load today"
              emptyBody="Something went wrong on our side. Your saved data is safe."
              errorCode="PLAN_LIMIT_REACHED"
              onRetry={() => {}}
            />
          </Card>
          <Card>
            <Txt className="text-label font-rubik-semibold text-text-2">
              Ready
            </Txt>
            <StatusView state="ready">
              <Txt className="text-body text-text-2">
                The ready state renders the screen&apos;s own content, so one
                component owns all four states.
              </Txt>
            </StatusView>
          </Card>
          <Card>
            <Txt className="text-label font-rubik-semibold text-text-2">
              Offline banner
            </Txt>
            <View className="mt-s3 gap-s3">
              <Alert
                tone="warn"
                title="Offline"
                body="Offline. Showing your last saved day."
              />
              <Alert tone="info" title="Syncing" body="Syncing 3 entries." />
            </View>
            <View className="mt-s4 flex-row items-center gap-s4">
              <Skeleton variant="circle" />
              <View className="flex-1 gap-s3">
                <Skeleton variant="line" width="70%" />
                <Skeleton variant="line" width="45%" />
              </View>
            </View>
          </Card>
        </Section>

        {/* ------------------------------------------------------ usage meter */}
        <Section
          title="Usage meter"
          note="Product data, so a filled track is correct here."
        >
          <View className="gap-s4">
            <UsageMeter label="Custom foods" value={7} goal={10} />
            <UsageMeter label="AI calls" value={9} goal={10} tone="warn" />
            <UsageMeter
              label="Custom reminders"
              value={4}
              goal={3}
              tone="over"
            />
          </View>
        </Section>

        {/* -------------------------------------- empty hero, steps and meter */}
        <Section
          title="Empty hero, steps, day dots and meter"
          note="The teaching empty state pairs a glyph tile with one sentence and one action. Steps explain an order. Day dots and the bare meter are the coach roster's data shapes."
        >
          <EmptyHero
            icon={<UsersThreeIcon />}
            title="No clients yet"
            body="Link your first client with their 8 character code. Their logs and progress show up here the moment they accept."
            actionLabel="Add a client"
            onAction={() => {}}
          />
          <EmptyLine
            icon={<ForkKnifeIcon />}
            title="No meals logged yet"
            sub="Breakfast, lunch and dinner are all empty today."
          />
          <NumberedSteps
            steps={[
              {
                title: "Your client shares their code",
                body: "It is on their Profile, My coach screen.",
              },
              {
                title: "You enter it and send a request",
                body: "They see it in their notifications.",
              },
              {
                title: "They accept, and you are linked",
                body: "One coach at a time, and they can unlink whenever they like.",
              },
            ]}
          />
          <Card>
            <View className="gap-s4">
              <View className="flex-row items-center justify-between gap-s3">
                <Txt className="text-label text-text-2">Last seven days</Txt>
                <DayDots
                  days={["on", "on", "none", "on", "part", "on", "none"]}
                />
              </View>
              <Meter percent={60} accessibilityLabel="60 percent of target" />
              <Meter
                percent={21}
                tone="warn"
                accessibilityLabel="21 percent of target"
              />
            </View>
          </Card>
        </Section>

        {/* --------------------------------------------------- navigation chrome */}
        <Section
          title="Navigation chrome"
          note="The app bar sits below the safe area, never under it. The tab bar sits above the home indicator."
        >
          <View className="gap-s3">
            <AppBar
              caption="Tuesday, 13 Oct"
              title="Hi, Sara"
              trailing={
                <>
                  <IconButton
                    icon={<BellIcon />}
                    accessibilityLabel="Notifications, 2 unread"
                    variant="ghost"
                    count={2}
                    onPress={() => {}}
                  />
                  <StreakBadge days={12} short />
                </>
              }
            />
            <AppBar
              caption="Tuesday, 13 Oct"
              title="Hi, Sara"
              trailing={<Avatar name="Sara" />}
            />
            <View className="overflow-hidden rounded-b-xl border-b-[1.5px] border-border">
              <DateNav
                label="Today"
                onPrevious={() => {}}
                onNext={() => {}}
                onLabelPress={presentPicker}
              />
            </View>
            <View className="overflow-hidden rounded-b-xl border-b-[1.5px] border-border">
              <DateNav
                label="Today"
                onPrevious={() => {}}
                onNext={() => {}}
                calendar={{
                  value: galleryDate,
                  onChange: () => {},
                  maxDate: galleryDate,
                }}
              />
            </View>
            <TabBar
              floating={false}
              tabs={[
                { key: "today", label: "Today", icon: <HouseIcon /> },
                { key: "diary", label: "Diary", icon: <BookOpenIcon /> },
                {
                  key: "progress",
                  label: "Progress",
                  icon: <ChartLineUpIcon />,
                },
                { key: "profile", label: "Profile", icon: <UserIcon /> },
              ]}
              activeKey={tab}
              onChange={setTab}
              centerIcon={<PlusIcon />}
              centerLabel="Log something"
              onCenterPress={() => {}}
            />
          </View>
        </Section>

        {/* ------------------------------------------------------- drag to delete */}
        <Section
          title="Swipe to delete"
          note="Swipe a row toward the end to reveal Delete. Nothing is removed on the swipe; the tap confirms it."
        >
          <View className="gap-s3">
            {dragRows.map((row) => (
              <DragRow
                key={row.id}
                className="rounded-lg border-2 border-border"
                surfaceClassName="bg-surface"
                actionTextClassName="text-black"
                onDelete={() => removeRow(row.id)}
              >
                <ListRow
                  icon={<EggIcon />}
                  title={row.title}
                  sub="1 plate"
                  value={row.kcal}
                  valueUnit="kcal"
                  className="bg-none"
                />
              </DragRow>
            ))}
          </View>
          <Button
            title="Add a row"
            variant="ghost"
            icon={<PlusIcon />}
            onPress={addRow}
          />
        </Section>

        {/* ----------------------------------------------------- settings group */}
        <Section title="Settings group and row">
          <View className="gap-s6">
            <SettingsGroup label="Tracking">
              <ListRow
                icon={<EggIcon />}
                iconTone="orange"
                title="Weight and target"
                navigate
                onPress={() => {}}
              />
              <ListRow
                icon={<HeartbeatIcon />}
                iconTone="green"
                title="Health apps"
                sub="Apple Health and Health Connect"
                navigate
                onPress={() => {}}
              />
            </SettingsGroup>
            <SettingsGroup label="Account">
              <ListRow
                icon={<PaletteIcon />}
                iconTone="sky"
                title="Appearance"
                value="Light"
                navigate
                onPress={() => {}}
              />
              <ListRow
                icon={<TranslateIcon />}
                iconTone="orange"
                title="Language"
                value="English"
                navigate
                onPress={() => {}}
              />
              <ListRow
                icon={<CameraIcon />}
                iconTone="berry"
                title="Export my data"
                sub="CSV ZIP of everything you logged"
                trailing={<Badge label="Pro" tone="locked" />}
                onPress={() => {}}
              />
            </SettingsGroup>
          </View>
        </Section>

        {/* --------------------------------------- permissions and share code */}
        <Section
          title="Permissions and share code"
          note="The client reads what a coach can do in plain statements. The code is only shown where it is needed: before a coach is linked."
        >
          <View className="gap-s6">
            <View className="gap-s2">
              <Txt className="text-label text-text-3">Permission list</Txt>
              <PermissionList
                items={[
                  {
                    icon: <PaperPlaneTiltIcon />,
                    text: "He can send you notes. They arrive in your notifications.",
                    tone: "yes",
                  },
                  {
                    icon: <PencilSlashIcon />,
                    text: "He cannot edit, delete or log anything for you.",
                    tone: "no",
                  },
                  {
                    icon: <ChatCircleSlashIcon />,
                    text: "There is no chat. Notes are one way.",
                    tone: "no",
                  },
                  {
                    icon: <LinkSimpleBreakIcon />,
                    text: "Unlinking removes his access immediately.",
                    tone: "no",
                  },
                ]}
              />
            </View>

            <View className="gap-s2">
              <Txt className="text-label text-text-3">Share code</Txt>
              <ShareCode code="K7M2P9QD" />
            </View>

            <View className="gap-s2">
              <Txt className="text-label text-text-3">Settled link</Txt>
              <Card className="flex-row items-center gap-s4">
                <Avatar name="Karim Haddad" tone="green" size="lg" />
                <View className="min-w-0 flex-1 gap-s1">
                  <Txt className="text-title text-text">Karim Haddad</Txt>
                  <Txt className="text-caption text-text-2">
                    Linked since 12 Oct 2026
                  </Txt>
                  <Badge
                    label="Active"
                    tone="success"
                    icon={<CheckCircleIcon />}
                    className="mt-s1"
                  />
                </View>
              </Card>
            </View>
          </View>
        </Section>

        {/* --------------------------------------------------------- limit grid */}
        <Section
          title="Limit grid"
          note="Nine plan limits in a two column grid. Locked cells can open the upgrade sheet. Not nine rows with hairline dividers."
        >
          <LimitGrid
            cells={[
              { name: "Custom foods", value: "7 / 10", sub: "Resets monthly" },
              { name: "Recipes", value: "2 / 3", sub: "Resets monthly" },
              { name: "Saved meals", value: "1 / 3", sub: "Current count" },
              { name: "Custom slots", value: "0", sub: "4 default on Free" },
              { name: "AI calls", value: "6 / 10", sub: "Resets monthly" },
              { name: "Coaches", value: "1 / 1", sub: "Max on every plan" },
              {
                name: "Recipes, Pro",
                value: "Unlimited",
                sub: "Locked on Free",
                locked: true,
                onPress: () => {},
              },
              {
                name: "AI calls, Pro",
                value: "300",
                sub: "Locked on Free",
                locked: true,
                onPress: () => {},
              },
            ]}
          />
        </Section>

        {/* ------------------------------------------------------- recipe cards */}
        <Section
          title="Recipe cards"
          note="Asymmetric by design: one large plus two small. Each card is a big image on top, a bold name, and muted details under it."
        >
          <View className="gap-s3">
            <RecipeCard
              lead
              title="Molokhia with rice and chicken"
              sub="640 kcal, 42 g protein"
            />
            <View className="flex-row gap-s3">
              <View className="flex-1">
                <RecipeCard title="Foul medames" sub="230 kcal" />
              </View>
              <View className="flex-1">
                <RecipeCard title="Mahshi" sub="310 kcal" />
              </View>
            </View>
            <RecipeCard
              title="Koshary"
              sub="Unlimited on Pro"
              width={152}
              lockedLabel="Pro"
            />
          </View>
        </Section>

        {/* -------------------------------------------------------- food cards */}
        <Section
          title="Food cards and horizontal scroll"
          note="The recipe card's shape at a smaller size, for foods. Put them in a horizontal scroller so ingredients stay tappable and never wrap into a tall list."
        >
          <HScroll bleed={false}>
            <FoodCard title="Molokhia" sub="300 g" />
            <FoodCard title="Rice, cooked" sub="1 cup" />
            <FoodCard title="Chicken thigh" sub="180 g" />
            <FoodCard title="Foul medames" sub="250 g" />
            <FoodCard title="Koshary" sub="1 plate" />
          </HScroll>
        </Section>

        {/* -------------------------------------------------------------- chart */}
        <Section title="Chart">
          <ProgressChart
            title="Weight, last 12 weeks"
            data={[
              { label: "W1", value: 79.2 },
              { label: "W2", value: 78.8 },
              { label: "W3", value: 78.9 },
              { label: "W4", value: 78.5 },
              { label: "W5", value: 78.2 },
              { label: "W6", value: 78.0 },
            ]}
            goal={72}
            badge={{ label: "Down 1.2 kg", tone: "success" }}
            footnote="Tuesday, 13 Oct. One honest number under the chart."
          />
          <ProgressChart
            bare
            data={[
              { label: "W1", value: 73.2 },
              { label: "W2", value: 73.1 },
              { label: "W3", value: 72.9 },
              { label: "W4", value: 73.0 },
              { label: "W5", value: 72.8 },
              { label: "W6", value: 72.7 },
            ]}
          />
          <Txt className="text-caption text-text-2">
            Bare: the coach chart drops its card and value labels, and shows the
            axis bounds instead.
          </Txt>
        </Section>

        {/* ------------------------------------------------------- coach record */}
        <Section
          title="Client record"
          note="The coach reads a client record and never edits it. A note is one way, so there is no read state and no reply."
        >
          <View className="gap-s6">
            <View className="gap-s2">
              <Txt className="text-label text-text-3">Meta row</Txt>
              <Card className="p-s5">
                <MetaRow
                  items={[
                    { icon: <ClockIcon />, label: "Last log today, 13:42" },
                    { icon: <LinkSimpleIcon />, label: "Linked 12 Oct" },
                    { icon: <EyeIcon />, label: "View only" },
                  ]}
                />
              </Card>
            </View>

            <View className="gap-s2">
              <Txt className="text-label text-text-3">Seven day bars</Txt>
              <Card>
                <WeekBars
                  days={[
                    { label: "Wed", state: "on", percent: 70 },
                    { label: "Thu", state: "on", percent: 76 },
                    { label: "Fri", state: "on", percent: 66 },
                    { label: "Sat", state: "on", percent: 62 },
                    { label: "Sun", state: "over", percent: 96 },
                    { label: "Mon", state: "none" },
                    { label: "Tue", state: "part", percent: 48, isToday: true },
                  ]}
                  targetPercent={80}
                  footnote="Averaging 1,440 kcal a day, 85% of target. Today is still in progress."
                />
              </Card>
            </View>

            <View className="gap-s2">
              <Txt className="text-label text-text-3">Note card</Txt>
              <NoteCard
                to="Sara"
                name="Sara Mahmoud"
                tone="orange"
                time="Today, 17:05"
                body="Nice lunch, Sara. Molokhia and chicken is a solid choice. Try swapping half the rice for salad tomorrow so there is room for dinner."
                context="Lunch, 13 Oct"
              />
              <NoteCard
                from="Karim Haddad"
                tone="green"
                time="Today, 17:05"
                body="Nice lunch, Sara. Molokhia and chicken is a solid choice. Try swapping half the rice for salad tomorrow so there is room for dinner."
                context="Lunch, 13 Oct"
                new
                onPress={() => {}}
              />
              <NoteCard
                from="Karim Haddad"
                tone="green"
                time="Your coach, today at 17:05"
                body="Nice lunch, Sara. Molokhia and chicken is a solid choice. Try swapping half the rice for salad tomorrow so there is room for dinner."
                context="Lunch, 13 Oct"
                contextIcon={<BowlFoodIcon />}
                contextOnPress={() => {}}
                big
              />
            </View>
          </View>
        </Section>

        {/* -------------------------------------------------- onboarding pieces */}
        <Section
          title="Onboarding pieces"
          note="Progress is dots only. There is no step count label, because a generic step label is a banned pattern."
        >
          <View className="gap-s4">
            <ProgressDots total={9} value={3} />
            <CodeBox value={cupInput.slice(0, 6)} onChangeText={setCupInput} />
            <Txt className="text-caption text-text-2">
              Verification code, six boxes, oneTimeCode hinted.
            </Txt>
          </View>
        </Section>

        {/* -------------------------------------------------------------- sheet */}
        <Section
          title="Sheets and scrim"
          note="A sheet is mounted at the app root, not next to the control that opened it, so it spans the display and sits above the tab bar. Radius 28, level 3 shadow, scrim behind. Drag it down to dismiss; it will not go up."
        >
          <Button
            title="Open the picker sheet"
            variant="secondary"
            icon={<CookieIcon />}
            onPress={presentPicker}
          />
          <Button
            title="Open the multi-select sheet"
            variant="secondary"
            icon={<WarningIcon />}
            onPress={presentMultiPicker}
          />
          <Button
            title="Open the notice sheet"
            variant="secondary"
            icon={<DropIcon />}
            onPress={presentNotice}
          />
        </Section>
        {/* ------------------------------------------- stepper + screen footer */}
        <Section
          title="Stepper and screen footer"
          note="The stepper is a quantity control: its value is tabular, editable in place, and its buttons stay 48dp. ScreenFooter pins one action above the safe area, so a screen never floats its primary action in the scroll."
        >
          <Group label="Stepper">
            <Stepper value={step} onChange={setStep} unit="plate" />
          </Group>
          <Group label="Screen footer">
            <View className="h-36 overflow-hidden rounded-lg bg-surface-2">
              <View className="flex-1 justify-end">
                <ScreenFooter>
                  <Button title="Add to Lunch" block />
                </ScreenFooter>
              </View>
            </View>
          </Group>
        </Section>

        {/* -------------------------------------- dates, verification and layout */}
        <Section
          title="Dates, verification and layout"
          note="DateField and CalendarSheet share the one sheet. InputOTP and CodeBox are digits-only verification inputs. Field, Stack and Label lay forms out without hand-built wrappers."
        >
          <Group label="DateField and CalendarSheet">
            <DateField
              label="Start date"
              value={dateValue}
              onChange={setDateValue}
              placeholder="Pick a date"
            />
            <Button
              title="Open calendar sheet"
              variant="secondary"
              icon={<ClockIcon />}
              onPress={presentCalendar}
            />
          </Group>
          <Group label="InputOTP and Checkbox">
            <InputOTP value={otp} onChange={setOtp} />
            <Txt className="text-caption text-text-2">
              Six boxes, digits only, one one-time-code hint.
            </Txt>
            <Checkbox
              checked={boxChecked}
              onChange={setBoxChecked}
              label="Agree to the terms"
            />
          </Group>
          <Group label="Field, Stack and Label">
            <Field label="Full name" help="We only use this to say hello.">
              <Input
                label="Full name"
                value={name}
                onChangeText={setName}
                placeholder="Sara"
              />
            </Field>
            <Stack gap="sm">
              <Txt className="text-caption text-text-2">
                First row in a stack.
              </Txt>
              <Txt className="text-caption text-text-2">
                Second row — Stack owns the gap.
              </Txt>
            </Stack>
            <Label text="Field label" />
            <Txt className="text-caption text-text-2">
              Label is the small caps caption used above fields and in settings.
            </Txt>
          </Group>
          <Group label="Toast">
            <Button
              title="Show real toast"
              variant="secondary"
              onPress={() => setRealToast(true)}
            />
            <Toast
              open={realToast}
              message="Saved. Your targets were updated."
              tone="success"
              actionLabel="Undo"
              onAction={() => setRealToast(false)}
              onClose={() => setRealToast(false)}
            />
          </Group>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
