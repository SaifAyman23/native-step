/**
 * Icon barrel using Expo Vector Icons (Ionicons).
 * Phosphor icons from react-rapido are mapped to Ionicons equivalents.
 * Every value in IconMap is a valid Ionicons glyph name, verified against
 * the installed Ionicons glyph map. Only the mapped names exist at runtime.
 */
import { Ionicons } from '@expo/vector-icons'
import { createElement, type ComponentType } from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export type IconName = keyof typeof Ionicons.glyphMap

export const IconMap: Record<string, IconName> = {
  trash: 'trash',
  apple: 'logo-apple',
  facebook: 'logo-facebook',
  google: 'logo-google',
  plus: 'add',
  minus: 'remove',
  pencil: 'create-outline',
  pencilSimple: 'create-outline',
  notePencil: 'create-outline',
  microphone: 'mic',
  chatCircleText: 'chatbubbles',
  barcode: 'barcode',
  magnifyingGlass: 'search',
  slidersHorizontal: 'settings',
  x: 'close',
  copy: 'copy',
  gear: 'settings',
  gauge: 'speedometer',
  usersThree: 'people',
  fileText: 'document-text',
  key: 'key',
  lockSimple: 'lock-closed',
  egg: 'egg-outline',
  bowlFood: 'restaurant-outline',
  forkKnife: 'pizza-outline',
  cookie: 'ice-cream-outline',
  coffee: 'cafe-outline',
  cookingPot: 'cafe',
  bell: 'notifications',
  bellRinging: 'notifications-outline',
  user: 'person',
  caretRight: 'chevron-forward',
  caretDown: 'chevron-down',
  caretLeft: 'chevron-back',
  cloudSlash: 'cloud-offline-outline',
  fire: 'flame',
  check: 'checkmark',
  checkCircle: 'checkmark-circle',
  xCircle: 'close-circle',
  warning: 'alert-circle',
  info: 'information-circle',
  drop: 'water',
  dropHalf: 'water-outline',
  lightning: 'flash',
  lightbulb: 'bulb',
  plugs: 'flash-outline',
  house: 'home',
  bookOpen: 'book-outline',
  books: 'book',
  bookmarks: 'bookmarks',
  bookmarkSimple: 'bookmark',
  shareNetwork: 'share',
  notebook: 'book',
  listPlus: 'add',
  clockCounterClockwise: 'time-outline',
  chartLineUp: 'trending-up',
  image: 'image',
  dotsThree: 'ellipsis-vertical',
  dotsThreeVertical: 'ellipsis-vertical',
  dotsSixVertical: 'ellipsis-vertical',
  scales: 'scale-outline',
  heart: 'heart',
  heartbeat: 'pulse',
  palette: 'color-palette',
  translate: 'language',
  downloadSimple: 'download',
  arrowsClockwise: 'refresh',
  clock: 'alarm-outline',
  waveform: 'pulse',
  cake: 'gift-outline',
  confetti: 'sparkles-outline',
  leaf: 'leaf-outline',
  camera: 'camera',
  barbell: 'barbell-outline',
  trendUp: 'trending-up',
  trendDown: 'trending-down',
  arrowRight: 'arrow-forward',
  arrowLeft: 'arrow-back',
  calendarCheck: 'calendar-clear-outline',
  calendarBlank: 'calendar-outline',
  target: 'locate-outline',
  timer: 'timer-outline',
  moon: 'moon',
  sun: 'sunny-outline',
  envelopeSimple: 'mail',
  eye: 'eye-outline',
  eyeSlash: 'eye-off-outline',
  shieldCheck: 'shield-checkmark-outline',
  squaresFour: 'grid-outline',
  personSimpleWalk: 'walk-outline',
  personSimpleRun: 'fitness-outline',
  bicycle: 'bicycle-outline',
  sparkle: 'sparkles',
  waves: 'water-outline',
  handWaving: 'hand-right-outline',
  userPlus: 'person-add-outline',
  paperPlaneTilt: 'paper-plane-outline',
  prohibit: 'ban-outline',
  hourglassMedium: 'hourglass-outline',
  linkSimple: 'link-outline',
  linkSimpleBreak: 'unlink-outline',
  signOut: 'log-out-outline',
  trophy: 'trophy-outline',
  arrowUpRight: 'arrow-forward-outline',
  bellSlash: 'notifications-off-outline',
  chatCircleSlash: 'chatbubbles-outline',
  checks: 'checkmark-done-outline',
  pencilSlash: 'pencil-outline',
  userCirclePlus: 'person-add-outline',
}

export interface RapidoIconProps {
  color?: string
  duotoneColor?: string
  duotoneOpacity?: number
  mirrored?: boolean
  size?: number | string
  weight?: string
  style?: StyleProp<ViewStyle | Omit<TextStyle, 'cursor'>>
  testID?: string
  title?: string
}

const COLOR_TOKENS: Record<string, string> = {
  text: '#18181b',
  'text-2': '#71717a',
  'text-3': '#a1a1aa',
  'text-zinc-900': '#18181b',
  'text-zinc-500': '#71717a',
  'text-zinc-400': '#a1a1aa',
  'on-primary': '#ffffff',
  primary: '#8B5CF6',
  'primary-text': '#8B5CF6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#f43f5e',
  info: '#3b82f6',
  white: '#ffffff',
}

function resolveIconColor(color?: string): string {
  if (!color) return '#18181b'
  const trimmed = color.trim()
  if (trimmed.startsWith('#') || trimmed.startsWith('rgb')) return trimmed
  for (const [token, hex] of Object.entries(COLOR_TOKENS)) {
    if (trimmed === token || trimmed.includes(token)) return hex
  }
  return trimmed || '#18181b'
}

function resolveIconSize(size?: number | string): number {
  const parsed = typeof size === 'string' ? Number.parseInt(size, 10) : size
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : 24
}

function createIcon(name: IconName): ComponentType<RapidoIconProps> {
  function RapidoIcon({ color, size, style, testID }: RapidoIconProps) {
    return createElement(Ionicons, {
      name,
      size: resolveIconSize(size),
      color: resolveIconColor(color),
      style: style as StyleProp<TextStyle>,
      testID,
    })
  }
  RapidoIcon.displayName = name
  return RapidoIcon
}

export const TrashIcon = createIcon(IconMap.trash)
export const AppleIcon = createIcon(IconMap.apple)
export const FacebookIcon = createIcon(IconMap.facebook)
export const GoogleIcon = createIcon(IconMap.google)
export const PlusIcon = createIcon(IconMap.plus)
export const MinusIcon = createIcon(IconMap.minus)
export const PencilIcon = createIcon(IconMap.pencil)
export const PencilSimpleIcon = createIcon(IconMap.pencilSimple)
export const NotePencilIcon = createIcon(IconMap.notePencil)
export const MicrophoneIcon = createIcon(IconMap.microphone)
export const ChatCircleTextIcon = createIcon(IconMap.chatCircleText)
export const BarcodeIcon = createIcon(IconMap.barcode)
export const MagnifyingGlassIcon = createIcon(IconMap.magnifyingGlass)
export const SlidersHorizontalIcon = createIcon(IconMap.slidersHorizontal)
export const XIcon = createIcon(IconMap.x)
export const CopyIcon = createIcon(IconMap.copy)
export const GearIcon = createIcon(IconMap.gear)
export const GaugeIcon = createIcon(IconMap.gauge)
export const UsersThreeIcon = createIcon(IconMap.usersThree)
export const FileTextIcon = createIcon(IconMap.fileText)
export const KeyIcon = createIcon(IconMap.key)
export const LockSimpleIcon = createIcon(IconMap.lockSimple)
export const EggIcon = createIcon(IconMap.egg)
export const BowlFoodIcon = createIcon(IconMap.bowlFood)
export const ForkKnifeIcon = createIcon(IconMap.forkKnife)
export const CookieIcon = createIcon(IconMap.cookie)
export const CoffeeIcon = createIcon(IconMap.coffee)
export const CookingPotIcon = createIcon(IconMap.cookingPot)
export const BellIcon = createIcon(IconMap.bell)
export const BellRingingIcon = createIcon(IconMap.bellRinging)
export const UserIcon = createIcon(IconMap.user)
export const CaretRightIcon = createIcon(IconMap.caretRight)
export const CaretDownIcon = createIcon(IconMap.caretDown)
export const CaretLeftIcon = createIcon(IconMap.caretLeft)
export const CloudSlashIcon = createIcon(IconMap.cloudSlash)
export const FireIcon = createIcon(IconMap.fire)
export const CheckIcon = createIcon(IconMap.check)
export const CheckCircleIcon = createIcon(IconMap.checkCircle)
export const XCircleIcon = createIcon(IconMap.xCircle)
export const WarningIcon = createIcon(IconMap.warning)
export const InfoIcon = createIcon(IconMap.info)
export const DropIcon = createIcon(IconMap.drop)
export const DropHalfIcon = createIcon(IconMap.dropHalf)
export const LightningIcon = createIcon(IconMap.lightning)
export const LightbulbIcon = createIcon(IconMap.lightbulb)
export const PlugsIcon = createIcon(IconMap.plugs)
export const HouseIcon = createIcon(IconMap.house)
export const BookOpenIcon = createIcon(IconMap.bookOpen)
export const BooksIcon = createIcon(IconMap.books)
export const BookmarksIcon = createIcon(IconMap.bookmarks)
export const BookmarkSimpleIcon = createIcon(IconMap.bookmarkSimple)
export const ShareNetworkIcon = createIcon(IconMap.shareNetwork)
export const NotebookIcon = createIcon(IconMap.notebook)
export const ListPlusIcon = createIcon(IconMap.listPlus)
export const ClockCounterClockwiseIcon = createIcon(IconMap.clockCounterClockwise)
export const ChartLineUpIcon = createIcon(IconMap.chartLineUp)
export const ImageIcon = createIcon(IconMap.image)
export const DotsThreeIcon = createIcon(IconMap.dotsThree)
export const DotsThreeVerticalIcon = createIcon(IconMap.dotsThreeVertical)
export const DotsSixVerticalIcon = createIcon(IconMap.dotsSixVertical)
export const ScalesIcon = createIcon(IconMap.scales)
export const HeartIcon = createIcon(IconMap.heart)
export const HeartbeatIcon = createIcon(IconMap.heartbeat)
export const PaletteIcon = createIcon(IconMap.palette)
export const TranslateIcon = createIcon(IconMap.translate)
export const DownloadSimpleIcon = createIcon(IconMap.downloadSimple)
export const ArrowsClockwiseIcon = createIcon(IconMap.arrowsClockwise)
export const ClockIcon = createIcon(IconMap.clock)
export const WaveformIcon = createIcon(IconMap.waveform)
export const CakeIcon = createIcon(IconMap.cake)
export const ConfettiIcon = createIcon(IconMap.confetti)
export const LeafIcon = createIcon(IconMap.leaf)
export const CameraIcon = createIcon(IconMap.camera)
export const BarbellIcon = createIcon(IconMap.barbell)
export const TrendUpIcon = createIcon(IconMap.trendUp)
export const TrendDownIcon = createIcon(IconMap.trendDown)
export const ArrowRightIcon = createIcon(IconMap.arrowRight)
export const ArrowLeftIcon = createIcon(IconMap.arrowLeft)
export const CalendarCheckIcon = createIcon(IconMap.calendarCheck)
export const CalendarBlankIcon = createIcon(IconMap.calendarBlank)
export const TargetIcon = createIcon(IconMap.target)
export const TimerIcon = createIcon(IconMap.timer)
export const MoonIcon = createIcon(IconMap.moon)
export const SunIcon = createIcon(IconMap.sun)
export const EnvelopeSimpleIcon = createIcon(IconMap.envelopeSimple)
export const EyeIcon = createIcon(IconMap.eye)
export const EyeSlashIcon = createIcon(IconMap.eyeSlash)
export const ShieldCheckIcon = createIcon(IconMap.shieldCheck)
export const SquaresFourIcon = createIcon(IconMap.squaresFour)
export const PersonSimpleWalkIcon = createIcon(IconMap.personSimpleWalk)
export const PersonSimpleRunIcon = createIcon(IconMap.personSimpleRun)
export const BicycleIcon = createIcon(IconMap.bicycle)
export const SparkleIcon = createIcon(IconMap.sparkle)
export const WavesIcon = createIcon(IconMap.waves)
export const HandWavingIcon = createIcon(IconMap.handWaving)
export const UserPlusIcon = createIcon(IconMap.userPlus)
export const PaperPlaneTiltIcon = createIcon(IconMap.paperPlaneTilt)
export const ProhibitIcon = createIcon(IconMap.prohibit)
export const HourglassMediumIcon = createIcon(IconMap.hourglassMedium)
export const LinkSimpleIcon = createIcon(IconMap.linkSimple)
export const LinkSimpleBreakIcon = createIcon(IconMap.linkSimpleBreak)
export const SignOutIcon = createIcon(IconMap.signOut)
export const TrophyIcon = createIcon(IconMap.trophy)
export const ArrowUpRightIcon = createIcon(IconMap.arrowUpRight)
export const BellSlashIcon = createIcon(IconMap.bellSlash)
export const ChatCircleSlashIcon = createIcon(IconMap.chatCircleSlash)
export const ChecksIcon = createIcon(IconMap.checks)
export const PencilSlashIcon = createIcon(IconMap.pencilSlash)
export const UserCirclePlusIcon = createIcon(IconMap.userCirclePlus)

export { Ionicons }
