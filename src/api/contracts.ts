/**
 * Wire contracts for the Qoot API (`/api/v1`).
 *
 * These mirror `backend/accounts/serializers.py` exactly: the backend is the
 * source of truth and rejects unknown request fields, so request types here
 * must stay closed rather than structural.
 */

export type AccountRole = 'client' | 'coach'

/** `UserSummarySerializer` — the person behind one or more accounts. */
export interface UserSummary {
  id: string
  email: string
  role: AccountRole | null
  is_email_verified: boolean
  onboarding_completed: boolean
}

/** `AccountSummarySerializer` — one role-scoped identity the person owns. */
export interface AccountSummary {
  id: string
  role: AccountRole
  full_name: string
  email: string
  is_active: boolean
  has_profile: boolean
  is_current: boolean
  unread_count: number
  needs_setup: boolean
  avatar_url: string | null
}

/** One image chosen from the device, ready for a multipart upload. */
export interface AvatarUpload {
  uri: string
  name: string
  type: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

/** `200/201 {user, account, access, refresh}` from login, social, verify. */
export interface AuthResponse extends AuthTokens {
  user: UserSummary
  account: AccountSummary
}

/** `201/200` register response: no tokens until the email is verified. */
export interface VerificationPendingResponse {
  user: UserSummary
  account: AccountSummary
  verification_required: boolean
  message: string
}

/** `GET /auth/me/` — the app router's source of truth. */
export interface MeResponse {
  user: UserSummary
  account: AccountSummary | null
  is_email_verified: boolean
  onboarding_completed: boolean
}

/** `GET /auth/accounts/` */
export type AccountsResponse = AccountSummary[]

/** `202` add-account request response. */
export interface AddAccountPendingResponse {
  email: string
  role: AccountRole
  verification_required: boolean
  message: string
}

export interface MessageResponse {
  message: string
}

export interface TokenRefreshRequest {
  refresh: string
}

export interface TokenRefreshResponse {
  access: string
  refresh?: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: AccountRole
}

export interface LoginRequest {
  email: string
  password: string
  account_id?: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
  account_id?: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  email: string
  code: string
  new_password: string
}

export interface PasswordChangeRequest {
  current_password: string
  new_password: string
}

export interface ClientOnboardingRequest {
  full_name: string
  gender: string
  age: number
  weight_kg: number
  height_cm: number
  activity_level: string
  goal: string
  pregnancy_status?: string | null
  target_weight_kg?: number | null
  target_date?: string | null
  diet_type?: string
  allergies?: string[]
  health_goals?: string[]
  obstacles?: string[]
  food_type?: string
  exercise_freq?: string
  unit_system?: string
  timezone?: string
}

export interface CoachOnboardingRequest {
  full_name: string
  gender: string
  age: number
}

/** `ClientProfilePatchSerializer` — every field is optional. */
export interface ClientProfilePatchRequest {
  full_name?: string
  gender?: string
  age?: number
  weight_kg?: number
  height_cm?: number
  activity_level?: string
  goal?: string
  pregnancy_status?: string | null
  target_weight_kg?: number | null
  target_date?: string | null
  fasting_mode?: string
  fasting_city?: string
  notifications_muted?: boolean
  diet_type?: string
  allergies?: string[]
  health_goals?: string[]
  obstacles?: string[]
  food_type?: string
  water_awareness?: string
  macro_awareness?: string
  exercise_freq?: string
  smartwatch?: string
  unit_system?: string
  language?: string
  timezone?: string
}

export interface WeightEntryRequest {
  weight_kg: number
  recorded_date: string
}

export interface WeightHistoryEntry {
  date: string
  weight_kg: string
  bmi: number | null
  target_weight_kg: string | null
  target_date: string | null
}

export interface ExerciseDefinition {
  id: string
  slug: string
  name: string
  name_ar: string
  met: string
  /** When true, show the duration input for this activity (default true). */
  show_duration?: boolean
  /** When true, show the distance input for this activity (default false). */
  show_distance?: boolean
}

export interface ExerciseEntry {
  id: string
  exercise: string
  exercise_name: string
  recorded_date: string
  duration_minutes: number
  distance_km: string | null
  calories_burned: number
}

export interface ActivitySummary {
  date: string
  steps: number | null
  health_calories_burned: number | null
  exercises: ExerciseEntry[]
}

export interface HomeMetric {
  key: string
  label: string
  unit: string
  consumed: number | null
  target: number | null
  remaining: number | null
}

export interface HomeWeekEntry {
  date: string
  weekday: number
  is_today: boolean
  calories_consumed: number | null
  calories_target: number | null
}

export interface HomeRecentMeal {
  id: string
  name: string
  logged_date: string
  slot: string | null
  macros: HomeMacro[]
  total_grams: number
}

export interface HomeMacro {
  key: string
  label: string
  unit: string
  value: number | null
}

export interface HomeMeal {
  id: string
  name: string
  slot: string | null
  calories_kcal: number | null
  foods: { name: string; calories_kcal: number | null }[]
}

export interface HomeWater {
  total_ml: number
  target_ml: number
  cups: number
}

export interface HomeRecipe {
  id: string
  name: string
  name_ar: string | null
  servings: number
  prep_time_min: number
  diet_type: string
  goal_tag: string
  macros_per_serving: Record<string, number | null>
}

export interface HomeMicronutrient {
  key: string
  value: number | null
  coverage: number | null
  percent: number | null
}

export interface HomeGapSuggestion {
  food_id: string
  name: string
  kcal: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  covers_pct: number | null
}

export interface HomeGap {
  gap_key: string
  percent: number
  suggestions: HomeGapSuggestion[]
}

export interface HomeFasting {
  mode: 'normal' | 'ramadan'
  is_ramadan: boolean
}

export interface HomeResponse {
  date: string
  metrics: HomeMetric[]
  week: HomeWeekEntry[]
  recent_meal: HomeRecentMeal | null
  meals: HomeMeal[]
  water: HomeWater
  recipes: HomeRecipe[]
  micros: HomeMicronutrient[]
  gaps: HomeGap[]
  fasting: HomeFasting
  activity: ActivitySummary
  notifications_unread_count: number
  streak_days: number
}

export interface HealthSyncRequest {
  provider: 'apple_health' | 'health_connect'
  days: Array<{
    date: string
    steps?: number
    calories_burned?: number
    source_record_id?: string
  }>
}

export type NotificationType =
  | 'SYSTEM'
  | 'welcome'
  | 'generic'
  | 'COACH_REQUEST'
  | 'COACH_REQUEST_ACCEPTED'
  | 'COACH_REQUEST_DECLINED'
  | 'COACH_LOGGING_ENABLED'
  | 'COACH_LOGGING_DISABLED'
  | 'REMINDER'
  | 'MEAL_REMINDER'
  | 'CUSTOM_REMINDER'
  | 'MEDICATION_REMINDER'
  | 'FAMILY_INVITED'
  | 'FAMILY_JOINED'
  | 'FAMILY_REMOVED'
  | 'FAMILY_RECOMMENDATION'
  | 'COACH_NOTE'

export type RelatedObjectType = 'order' | 'user' | 'generic' | 'note'

export interface NotificationItem {
  id: string
  type: string
  title: string
  body: string
  data: Record<string, unknown>
  is_read: boolean
  read_at: string | null
  scheduled_at: string | null
  delivery_status: string
  created_at: string
  related_object_type?: string | null
}

export interface NotificationsResponse {
  results: NotificationItem[]
  unread_count: number
}

export interface LogoutRequest {
  refresh?: string
}

export interface AddAccountLoginRequest {
  email: string
  password: string
  account_id?: string
}

export interface AddAccountRequest {
  email: string
  role: AccountRole
}

export interface AddAccountVerifyRequest {
  email: string
  code: string
}

export interface AddAccountResendRequest {
  email: string
}

export interface GoogleSocialLoginRequest {
  id_token?: string
  code?: string
  redirect_uri?: string
  code_verifier?: string
  role?: AccountRole
}

export interface AppleSocialLoginRequest {
  identity_token: string
  role?: AccountRole
  nonce?: string
  full_name?: Record<string, unknown>
}

export interface FacebookSocialLoginRequest {
  access_token: string
  role?: AccountRole
}

/** JSON scalar shapes emitted by DRF DecimalField and Date/DateTime fields. */
export type ApiDecimal = string | number
export type NullableApiDecimal = ApiDecimal | null

/** `StandardPagination` page envelope: `pagination` + `links` + `results`. */
export interface Paginated<T> {
  pagination: {
    count: number
    page_size: number
    total_pages: number
    current_page: number
    has_next: boolean
    has_previous: boolean
  }
  links: { next: string | null; previous: string | null }
  results: T[]
}

/** Cursor envelope: `results` + `next` + `previous`. */
export interface CursorPaginated<T> {
  results: T[]
  next: string | null
  previous: string | null
}

export interface EmailChangeRequest {
  new_email: string
}

export interface EmailChangeConfirmRequest {
  new_email: string
  code: string
  refresh?: string
}

export interface ProfileResponse extends ClientProfileResponse {
  role: AccountRole
  coach: null
}

export interface ClientProfileResponse {
  id: string
  account_id: string
  full_name: string
  gender: string
  age: number
  weight_kg: NullableApiDecimal
  height_cm: NullableApiDecimal
  bmi: number | null
  activity_level: string
  goal: string
  link_token: string | null
  fasting_mode: string
  fasting_city: string
  fasting_lat: NullableApiDecimal
  fasting_lon: NullableApiDecimal
  notifications_muted: boolean
  pregnancy_status: string | null
  target_weight_kg: NullableApiDecimal
  target_date: string | null
  diet_type: string
  allergies: string[]
  health_goals: string[]
  obstacles: string[]
  food_type: string
  water_awareness: string
  macro_awareness: string
  exercise_freq: string
  smartwatch: string
  unit_system: string
  language: string
  timezone: string
  stage: string
  daily_calorie_target: NullableApiDecimal
  daily_protein_target_g: NullableApiDecimal
  daily_carbs_target_g: NullableApiDecimal
  daily_fat_target_g: NullableApiDecimal
  created_at: string
  updated_at: string
}

export interface CoachProfileResponse {
  id: string
  account_id: string
  full_name: string
  gender: string
  age: number
  language: string
  notifications_muted: boolean
  timezone: string
  stage: string
  created_at: string
  updated_at: string
  role: 'coach'
  coach: null
}

export interface FoodCategoryResponse {
  id: string
  slug: string
  name: string
  name_en: string
  name_ar: string
  parent: string | null
  sort_order: number
  children: FoodCategoryResponse[]
}

export interface FoodServingResponse {
  id: string
  name: string
  grams: NullableApiDecimal
  amount: NullableApiDecimal
  unit: string
  modifier: string
}

export interface FoodSummaryResponse {
  id: string
  name: string
  brand: string
  calories_kcal: NullableApiDecimal
  protein_g: NullableApiDecimal
  carbs_g: NullableApiDecimal
  fat_g: NullableApiDecimal
}

export interface FoodItemResponse extends FoodSummaryResponse {
  barcode: string
  category: FoodCategoryResponse | null
  source: string
  fiber_g: NullableApiDecimal
  sugar_g: NullableApiDecimal
  saturated_fat_g: NullableApiDecimal
  cholesterol_mg: NullableApiDecimal
  sodium_mg: NullableApiDecimal
  calcium_mg: NullableApiDecimal
  iron_mg: NullableApiDecimal
  magnesium_mg: NullableApiDecimal
  phosphorus_mg: NullableApiDecimal
  potassium_mg: NullableApiDecimal
  zinc_mg: NullableApiDecimal
  selenium_mcg: NullableApiDecimal
  vitamin_c_mg: NullableApiDecimal
  vitamin_e_mg: NullableApiDecimal
  vitamin_a_mcg: NullableApiDecimal
  vitamin_d_mcg: NullableApiDecimal
  vitamin_b12_mcg: NullableApiDecimal
  folate_mcg: NullableApiDecimal
  servings: FoodServingResponse[]
  conversions?: Record<string, NullableApiDecimal>
  energy_estimated?: boolean
}

export interface FoodItemCreateRequest {
  name: string
  name_ar?: string
  brand?: string
  barcode?: string
  category_id?: string | null
  default_serving_g: ApiDecimal
  calories_kcal: NullableApiDecimal
  protein_g: NullableApiDecimal
  carbs_g: NullableApiDecimal
  fat_g: NullableApiDecimal
  fiber_g?: NullableApiDecimal
  sugar_g?: NullableApiDecimal
  saturated_fat_g?: NullableApiDecimal
  cholesterol_mg?: NullableApiDecimal
  sodium_mg?: NullableApiDecimal
  calcium_mg?: NullableApiDecimal
  iron_mg?: NullableApiDecimal
  magnesium_mg?: NullableApiDecimal
  phosphorus_mg?: NullableApiDecimal
  potassium_mg?: NullableApiDecimal
  zinc_mg?: NullableApiDecimal
  selenium_mcg?: NullableApiDecimal
  vitamin_c_mg?: NullableApiDecimal
  vitamin_e_mg?: NullableApiDecimal
  vitamin_a_mcg?: NullableApiDecimal
  vitamin_d_mcg?: NullableApiDecimal
  vitamin_b12_mcg?: NullableApiDecimal
  folate_mcg?: NullableApiDecimal
  allergens?: string[]
  servings?: Record<string, unknown>[]
}

export interface MealSlotResponse {
  id: string
  name: string
  name_ar: string
  sort_order: number
  is_default: boolean
  scope: string
  default_time: string | null
  is_active: boolean
}

export interface MealActorResponse {
  id: string
  full_name: string
  role: 'coach'
}

export interface MealItemResponse {
  id: string
  food_item: FoodSummaryResponse
  food_item_id: string
  name: string
  name_ar: string | null
  quantity_g: ApiDecimal
  nutrients: Record<string, NullableApiDecimal>
  frozen_nutrients: Record<string, NullableApiDecimal>
  food_name_snapshot: string
}

export interface MealSummaryResponse {
  consumed: Record<string, NullableApiDecimal>
  targets: Record<string, NullableApiDecimal>
  remaining: Record<string, NullableApiDecimal>
}

export interface MealResponse {
  id: string
  name: string
  slot: MealSlotResponse
  slot_id: string
  logged_date: string
  logged_at: string
  source: string
  recipe: string | null
  items: MealItemResponse[]
  day_summary: MealSummaryResponse
  logged_by: MealActorResponse | null
  modified_by: MealActorResponse | null
}

export interface MealDetailResponse extends MealResponse {
  macros: HomeMacro[]
  micros: HomeMicronutrient[]
  total_grams: ApiDecimal
}

export interface MealItemRequest {
  food_item_id: string
  quantity_g: ApiDecimal
}

export interface MealRequest {
  name: string
  slot_id: string
  logged_date: string
  items: MealItemRequest[]
}

export interface RecipeItemResponse {
  id: string
  food_item: FoodSummaryResponse
  food_item_id: string
  name: string
  name_ar: string | null
  quantity_g: ApiDecimal
  nutrients: Record<string, NullableApiDecimal>
}

export interface RecipeResponse {
  id: string
  name: string
  name_ar: string
  servings: number
  cooked_weight_g: NullableApiDecimal
  category: FoodCategoryResponse | null
  image_key: string | null
  prep_time_min: number
  diet_type: string
  goal_tag: string
  tags: string[]
  is_active: boolean
  is_system: boolean
  items: RecipeItemResponse[]
  created_at: string
}

export interface RecipeDetailResponse extends RecipeResponse {
  total_weight_g: ApiDecimal
  totals: Record<string, NullableApiDecimal>
  per_serving: Record<string, NullableApiDecimal> | null
  per_100g: Record<string, NullableApiDecimal> | null
}

export interface RecipeItemRequest {
  food_item_id: string
  quantity_g: ApiDecimal
}

export interface RecipeRequest {
  name: string
  name_ar?: string
  servings: number
  cooked_weight_g?: NullableApiDecimal
  category_id?: string | null
  image_key?: string | null
  prep_time_min: number
  diet_type: string
  goal_tag: string
  tags: string[]
  is_active?: boolean
  items: RecipeItemRequest[]
}

/** `POST/PATCH /api/v1/recipes/{id}/log/` — the portion the person ate. */
export interface RecipeLogRequest {
  slot_id?: string
  logged_date?: string
  servings_eaten?: ApiDecimal
  grams_eaten?: ApiDecimal
}

export interface SavedMealItemResponse {
  id: string
  food_item: FoodSummaryResponse | null
  food_item_id?: string
  recipe: string | null
  recipe_id?: string
  quantity_g: ApiDecimal
}

export interface SavedMealResponse {
  id: string
  name: string
  slot: MealSlotResponse | null
  slot_id?: string | null
  is_active: boolean
  items: SavedMealItemResponse[]
  created_at: string
}

export interface SavedMealRequest {
  name: string
  slot_id?: string | null
  is_active?: boolean
  items: {
    food_item_id?: string | null
    recipe_id?: string | null
    quantity_g: ApiDecimal
  }[]
}

export interface FoodFavoriteResponse {
  id: string
  food_item: FoodSummaryResponse | null
  recipe: string | null
  food_item_id?: string
  recipe_id?: string
  created_at: string
}

export interface FoodFavoriteRequest {
  food_item_id?: string | null
  recipe_id?: string | null
}

export interface DiaryResponse {
  date: string
  member: Record<string, unknown> | null
  meals: MealResponse[]
  recipes: RecipeResponse[]
  day_totals: DiaryDayTotals
}

export interface DiaryMetric {
  consumed: NullableApiDecimal
  target: NullableApiDecimal
  remaining: NullableApiDecimal
  coverage: number | null
}

export interface DiaryDayTotals {
  date: string
  calories: DiaryMetric
  protein: DiaryMetric
  carbs: DiaryMetric
  fat: DiaryMetric
  total_grams: ApiDecimal
  meal_count: number
}

export interface LibraryResponse {
  recent: FoodItemResponse[]
  most_eaten: Array<FoodItemResponse & { eat_count: number }>
  recipes: RecipeResponse[]
  saved_meals: SavedMealResponse[]
  favorites: FoodFavoriteResponse[]
}

/** `GET /api/v1/recipes/` page envelope from `StandardPagination`. */
export type RecipeListResponse = Paginated<RecipeResponse>

export interface NotificationResponse extends NotificationItem {
  related_object_id: string | null
  related_object_type: string | null
  link_status: string | null
}

export interface DeviceResponse {
  id: string
  token: string
  device_uuid: string
  platform: 'android' | 'ios' | 'web'
  device_name: string
  is_active: boolean
  notifications_enabled: boolean
  last_seen_at: string | null
}

export interface DeviceRegisterRequest {
  token: string
  device_uuid: string
  platform: 'android' | 'ios' | 'web'
  device_name?: string
}

export interface CustomReminderResponse {
  id: string
  name: string
  name_ar: string
  time: string
  days_of_week: number[]
  is_active: boolean
  created_at: string
}

export interface CustomReminderRequest {
  name: string
  time: string
  days_of_week: number[]
  is_active?: boolean
}

export interface LinkPersonResponse {
  id: string
  full_name: string
}

export interface CoachClientLinkResponse {
  id: string
  status: string
  coach: LinkPersonResponse
  client: LinkPersonResponse
  coach_can_log: boolean
  requested_at: string
  responded_at: string | null
}

export interface ClientRequestRequest {
  token: string
}

export interface CoachLogToggleRequest {
  coach_can_log: boolean
}

export type CoachFeedResponse = CursorPaginated<Record<string, unknown>>

/** `LinkStatus` — the coach/client link lifecycle. */
export type CoachLinkStatus = 'PENDING' | 'ACTIVE' | 'DECLINED' | 'UNLINKED' | 'CANCELLED'

/** Whether a roster row needs the coach's attention, and why (`coaching/selectors`). */
export type CoachAttention = 'ok' | 'warn'

/** Compact day dot on roster rows and Home cards: `over` collapses to `on`. */
export type CoachDayStateValue = 'none' | 'part' | 'on' | 'over'

/** `client_reasons()` — enums plus numbers; the app composes the copy. */
export type CoachAttentionReason =
  | { code: 'no_log_today' }
  | { code: 'below_target'; percent: number }
  | { code: 'weight_up'; change_kg: NullableApiDecimal }

export interface CoachLastLog {
  at: string
  date: string
  days_ago: number
}

export interface CoachClientIdentity {
  id: string
  full_name: string
  goal: string | null
  target_weight_kg: NullableApiDecimal
}

/** One 7-day strip cell on a roster row (`_days()` in `selectors/roster.py`). */
export interface CoachClientDay {
  date: string
  weekday: number
  state: CoachDayStateValue
  percent: number | null
  is_today: boolean
}

/** `client_row()` / `pending_row()` — pending links carry null metrics. */
export interface CoachClientRow {
  link_id: string
  status: CoachLinkStatus
  can_log: boolean
  linked_at: string
  client: CoachClientIdentity
  attention: CoachAttention | null
  reasons: CoachAttentionReason[]
  logged_today: boolean
  kcal_today: NullableApiDecimal
  target_kcal: number | null
  percent: number | null
  days: CoachClientDay[]
  streak: number | null
  last_log: CoachLastLog | null
}

export interface CoachHomeStats {
  clients_total: number
  pending_requests: number
  logged_today: number
  on_target: number
  need_attention: number
}

export interface CoachFeedClient {
  id: string
  full_name: string
}

export interface CoachFeedSlot {
  id: string
  name: string
  name_ar: string | null
}

export interface CoachFeedMeal {
  id: string
  name: string
  slot: CoachFeedSlot | null
  macros: HomeMacro[]
}

/** One Home activity event: a logged meal (or breakfast) or a weigh-in. */
export interface CoachFeedItem {
  id: string
  kind: 'meal' | 'breakfast' | 'weight'
  client: CoachFeedClient
  meal: CoachFeedMeal | null
  weight_kg: NullableApiDecimal
  recorded_at: string
  recorded_date: string
}

/** `GET /coach/home/` — one bounded aggregate, never one request per client. */
export interface CoachHomeResponse {
  date: string
  stats: CoachHomeStats
  attention: CoachClientRow[]
  clients: CoachClientRow[]
  feed: CoachFeedItem[]
}

export interface CoachClientSummary {
  id: string
  full_name: string
  goal: string | null
  age: number | null
  weight_kg: NullableApiDecimal
  height_cm: NullableApiDecimal
  bmi: number | null
  target_weight_kg: NullableApiDecimal
  target_date: string | null
  fasting_mode: string
}

export interface CoachMacroTargets {
  kcal: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
}

export interface CoachTodayBlock {
  date: string
  kcal: NullableApiDecimal
  protein_g: NullableApiDecimal
  carbs_g: NullableApiDecimal
  fat_g: NullableApiDecimal
  targets: CoachMacroTargets
  percent: number | null
}

/** Detail week cell — keeps `over` instead of collapsing it. */
export interface CoachWeekDay {
  date: string
  weekday: number
  state: CoachDayStateValue
  percent: number | null
  calories_kcal: NullableApiDecimal
  is_today: boolean
}

export interface CoachWeekBlock {
  days: CoachWeekDay[]
  target_percent: number
  logged_days: number
  average_kcal: string | null
  average_percent: number | null
}

export interface CoachWaterLimit {
  ml: number
  target_ml: number
  cups: number
  cup_ml: number
}

export interface CoachStepsLimit {
  value: number | null
  target: number
}

export interface CoachExerciseLimit {
  sessions: number
  calories_burned: number
}

export type CoachChangeTrend = 'up' | 'down' | 'flat' | null

export interface CoachWeightLimit {
  current_kg: NullableApiDecimal
  recorded_date: string | null
  change_kg: NullableApiDecimal
  change_trend: CoachChangeTrend
}

export interface CoachLimits {
  water: CoachWaterLimit
  steps: CoachStepsLimit
  exercise: CoachExerciseLimit
  weight: CoachWeightLimit
}

/** `_macro_metrics()` — consumed/target/remaining per macro, decimals as strings. */
export interface CoachMacroMetric {
  key: string
  label: string
  unit: string
  consumed: NullableApiDecimal
  target: NullableApiDecimal
  remaining: NullableApiDecimal
}

export interface CoachMicronutrient {
  key: string
  value: NullableApiDecimal
  coverage: number | null
  percent: number | null
}

/** `GET /coach/clients/{client_id}/?date=` — the coach client overview. */
export interface CoachClientDetailResponse {
  summary: CoachClientSummary
  attention: CoachAttention
  reasons: CoachAttentionReason[]
  streak_days: number
  linked_at: string
  last_log: CoachLastLog | null
  today: CoachTodayBlock
  week: CoachWeekBlock
  limits: CoachLimits
  metrics: CoachMacroMetric[]
  micros: CoachMicronutrient[]
  fasting: HomeFasting
  permissions: { can_log: boolean }
}

export type CoachHistoryRange = '4w' | '12w' | 'all'

export interface CoachWeightPoint {
  date: string
  label: string
  value: number
}

export interface CoachWeighIn {
  id: string
  date: string
  weight_kg: NullableApiDecimal
  change_kg: NullableApiDecimal
  change_trend: CoachChangeTrend
}

export interface CoachCalorieAverages {
  average: string | null
  days_logged: number
  days_in_range: number
  target: number | null
}

export interface CoachProteinAverages {
  goal_days: number
  days_logged: number
  days_in_range: number
  target: number | null
}

export interface CoachWaterAverages {
  average: string | null
  target_ml: number
  days_in_range: number
}

export interface CoachAverages {
  calories_kcal: CoachCalorieAverages
  protein_g: CoachProteinAverages
  water_ml: CoachWaterAverages
  exercise: CoachExerciseLimit
}

/** `GET /coach/clients/{client_id}/weight-history/?range=`. */
export interface CoachWeightHistoryResponse {
  range: CoachHistoryRange
  start: string
  end: string
  target_weight_kg: NullableApiDecimal
  target_date: string | null
  current_weight_kg: NullableApiDecimal
  start_weight_kg: NullableApiDecimal
  change_kg: NullableApiDecimal
  change_trend: CoachChangeTrend
  points: CoachWeightPoint[]
  weigh_ins: CoachWeighIn[]
  averages: CoachAverages
}

/** Cursor envelope for `GET /coach/clients/{client_id}/meals/`. */
export type CoachDiaryResponse = CursorPaginated<MealResponse>

export interface CoachDiaryQuery {
  date?: string
  slot_id?: string
  nutrient?: string
  min?: ApiDecimal
  max?: ApiDecimal
  cursor?: string
  page_size?: number
}

export interface CoachNoteResponse {
  id: string
  client: { id: string; full_name: string }
  body: string
  context: string
  created_at: string
  updated_at: string
}

export interface CoachNoteRequest {
  body: string
  context?: string
}

export interface CoachNoteUpdateRequest {
  body?: string
  context?: string
}

export interface SubscriptionPlanResponse {
  id: string
  name: string
  slug: string
  stage: string
  description: string
  price: NullableApiDecimal
  currency: string
  billing_period: string
  revenuecat_entitlement: string
  is_default: boolean
  is_active: boolean
  is_public: boolean
  sort_order: number
}

export interface SubscriptionResponse {
  id: string
  plan: SubscriptionPlanResponse
  status: string
  source: string
  starts_at: string
  ends_at: string | null
  created_at: string
}

export interface SubscriptionUsageResponse {
  [key: string]: NullableApiDecimal | string | number | boolean | null
}

export interface FAQResponse {
  id: string
  question: string
  answer: string
  sort_order: number
  is_published: boolean
  created_at: string
}

export interface PolicySummaryResponse {
  slug: string
  title: string
  version: string
}

export interface PolicyDetailResponse extends PolicySummaryResponse {
  content: string
}

export interface PolicyAcceptanceResponse {
  policy_slug: string
  version: string
  accepted_at: string
}

export interface ContactMessageRequest {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactMessageResponse extends ContactMessageRequest {
  id: string
  created_at: string
}

export interface ContactInfoResponse {
  id: string
  address: string
  phone: string
  email: string
  working_hours: string
  start_hours: string
  end_hours: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  linkedin_url: string
  latitude: NullableApiDecimal
  longitude: NullableApiDecimal
  ordering_open: boolean
  site_inactive: boolean
}

export interface AiGenerateRequest {
  slot_id?: string
  prompt?: string
  text?: string
}

export interface AiSuggestionResponse {
  id: string
  status: string
  payload: Record<string, unknown>
}

export interface AiLogSuggestionRequest {
  slot_id?: string
  portion_scale?: ApiDecimal
  logged_date?: string
  items?: { index: number; quantity_g: ApiDecimal }[]
}

export interface WaterLogResponse {
  total_ml: number
  target_ml: number
  cups: number
}

/** The single error envelope every endpoint returns (`backend/common/exceptions.py`). */
export interface ErrorPayload {
  code: string
  message: string
  message_ar: string | null
  fields: Record<string, unknown> | null
  detail?: unknown
}

/** Error codes the auth contract can return. Compared case-sensitively. */
export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  INVALID_SOCIAL_TOKEN: 'INVALID_SOCIAL_TOKEN',
  ROLE_REQUIRED: 'ROLE_REQUIRED',
  INVALID_CODE: 'INVALID_CODE',
  CODE_EXPIRED: 'CODE_EXPIRED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  THROTTLED: 'THROTTLED',
  ACCOUNT_LIMIT_REACHED: 'ACCOUNT_LIMIT_REACHED',
  ACCOUNT_ALREADY_ADDED: 'ACCOUNT_ALREADY_ADDED',
  ACCOUNT_OWNERSHIP_CONFLICT: 'ACCOUNT_OWNERSHIP_CONFLICT',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
  PROFILE_ALREADY_EXISTS: 'PROFILE_ALREADY_EXISTS',
  FORBIDDEN_ROLE: 'FORBIDDEN_ROLE',
  UNKNOWN_FIELD: 'UNKNOWN_FIELD',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
