# React Rapido Native

General-use Expo mobile template. Expo SDK 57 + React Native 0.86 + NativeWind v4 + Expo Router 57. `className` only, no `StyleSheet`, no webviews.

Components library is the **second tab after Home**. All UI lives in `src/components/ui`, styled with rapido theme tokens from `src/theme`. Sheets, hooks, and stores are ported from Qoot mobile and generalized — nothing was deleted, nutrition-specific names are kept with generic aliases and generic showcase content.

## Quick start

```bash
# Install (SDK-pinned — always use expo install)
npx expo install axios zustand @tanstack/react-query clsx tailwind-merge expo-secure-store
npm install

# Env (.env not committed)
EXPO_PUBLIC_APP_NAME=React Rapido Native
EXPO_PUBLIC_API_URL=https://api.example.com/api/v1

# Dev
npx expo start
```

| Command | Purpose |
|---|---|
| `npx expo start` | Dev server (scan with Expo Go) |
| `npx tsc --noEmit` | Typecheck — must be 0 errors |
| `npx expo lint` | Lint |
| `npm test` | Jest with `@testing-library/react-native` |
| `npx expo-doctor` | Diagnose |

## Tabs

`(tabs)/_layout.tsx` defines two tabs in order:

1. **Home** — `(home)/`
2. **Components** — `(showcase)/` — the components library. Open it to copy any component's usage.

Each tab is a `Stack` with hidden headers and the floating glass tab bar (blur + violet active tint).

## Structure

```
src/
  app/                 # Expo Router routes only (thin screens)
    _layout.tsx
    +not-found.tsx
    login.tsx | register.tsx | forgot-password.tsx | verify-otp.tsx | reset-password.tsx
    (tabs)/
      _layout.tsx      # Tabs: Home, Components (in that order)
      (home)/          # Home stack
      (showcase)/      # Components library stack
  api/                 # 3-file pattern per domain
    axiosInstance.ts   # SecureStore token, router.replace on 401
    accounts/ endpoints + registerApi + hooks
    profile/ users/ types / useInfiniteList
    contracts.ts       # Generic shared types (e.g. AvatarUpload)
  components/
    ui/                # Design system (73 files) — see below
    auth/ landing/ theme/
    shared/navigation/TabBarInsetContext.tsx
  theme/               # Design tokens — single source of truth
    tokens.js          # Raw values ONLY here (CommonJS for tailwind.config.js)
    colors spacing radius typography shadows motion vars
    useThemeColors.ts  # Real color strings for TextInput, icons, worklets
  lib/                 # utils, validators, date, haptics, queryClient, queryKeys
  hooks/               # Ported, generalized hooks
    useConnection useDebounce useIsMobile useNearView usePreviewState
    useRefresh useSectionTracker useAvatarPicker
  store/
    auth/authStore      # Zustand
    theme/themeStore
    dev/previewStore    # DEV-only preview state (loading/empty/error)
  i18n/                # en/ar locales
  types/
```

## Theme

`src/theme/tokens.js` holds every raw value. Everything else imports from `@/theme`.

- Semantic colors per scheme via `colorsFor()` / `useThemeColors()` — use this when you need a real hex string (placeholder color, icon color, Reanimated worklets).
- Tailwind classes read the same tokens via `tailwind.config.js`.
- `src/store/theme/themeStore.ts` + `useResolvedScheme()` resolves `system | light | dark`.

Styling rules: `className` only. All text inside `Txt` from `@/components/ui` (never bare RN `Text` in components).

## Components (`src/components/ui`)

73 files, all exported from `src/components/ui/index.ts`. Import from `@/components/ui`, never deep paths.

Core primitives: `Button` (loading/block), `Input`, `TextArea`, `Txt` (numeric/tracking), `Card`, `Badge`, `Chip`, `Checkbox`, `Switch`, `Field`, `Label`, `AppBar`, `Tabs`, `TabBar`, `KeyboardAvoiding` handled per screen.

Sheets: `Sheet` (`SheetSurface`, `SheetPicker`) + `SheetHost` (`SheetHost`, `useSheet`, `useOptionalSheet`). Full gesture/keyboard/height sync ported from Qoot. `Select`, `DateField`, `CalendarSheet` sit on top of it. The showcase page demonstrates all of them.

Progress & display: `HeroCard`, `MacroBar` (also `ProgressBar`), `QootRing` (also `ProgressRing`), `WaterCups` (also `CupMeter`/`CountMeter`/`CupCard` — count-based, not water-specific), `WeekBars`, `WeekStrip`, `Meter`, `ProgressDots`, `ProgressChart`, `Skeleton`, `Spinner`, `StatTile`, `MicroList` (also `KeyValueList`), `DataChip`, `ListRow` (`MetricLabels`/`MetricDots`/`TotalFooter`).

States: `StatusView` (loading/empty/error/ready), `EmptyHero`, `EmptyLine`, `Alert` (`Banner`, `WaterNudge`), `Toast` + `useToast`.

Navigation & lists: `Stack`, `Rows`, `MetaRow`, `ChoiceRow`, `DragRow`, `SearchInput`, `Segmented`, `Stepper`, `InputOTP`, `PressEdge`, `Fab`, `Icon`, `IconButton`.

Media cards: `RecipeCard` / `FoodCard` in `Cards.tsx` are generic media cards — also exported as `MediaCard` / `CompactMediaCard`. Image+title+sub+press, nothing food-specific.

Generalization: components kept their names for compatibility, but generic aliases and generic props/docs make them usable for any product. The showcase (`(showcase)/index.tsx`) uses neutral labels (Option/Metric/Item) for every demo.

### Icons

`src/components/ui/icons.ts` maps Phosphor-style names to **Ionicons** — every value is a valid Ionicons glyph verified against the installed glyph map. Components accept Phosphor-style props (`size`, `color`, `weight`, `style`, `testID`). Use `<Glyph icon={<PlusIcon />} {...useQootIcon()} />` for themed icons.

## Hooks (`src/hooks`)

- `useConnection` — network gate with `auto|offline|online` mode + UNKNOWN timeout. `resolveConnection()` is unit-tested.
- `useDebounce`, `useIsMobile`, `useNearView`, `useSectionTracker` — layout/section utilities.
- `usePreviewState` / `useRetry` — DEV-only `?state=loading|empty|error` or preview store, for testing screens without an API.
- `useRefresh(onRefresh?)` — pull-to-refresh state; pass a query `refetch` when you wire real data.
- `useAvatarPicker()` — image picker → `AvatarUpload` (`uri/name/type`). Requires `expo-image-picker`.

All exported from `src/hooks/index.ts`.

## Lib & stores

- `src/lib/date.ts` (`toDateKey`, `formatLongDate`, `parseDateKey`, `addDays`, reads `date.months` from i18n), `src/lib/haptics.ts` (`tapSelection`, `tapImpact`, `tapResult`), `src/lib/queryClient.ts`, `src/lib/queryKeys.ts`, `src/lib/sessionReset.ts` (generic — clears query cache; wire auth clearing in your app).
- `src/components/shared/navigation/TabBarInsetContext.tsx` — `TabBarInsetProvider` / `useTabBarBottomInset()` so sheets/toasts clear the floating tab bar.
- `src/store/dev/previewStore.ts` — DEV preview state only.

## Tests

```bash
npm test
```

UI tests live next to components (`Button.test.tsx`, `Select.test.tsx`, `SheetHost.test.tsx`, `Toast.test.tsx`, …) plus `useConnection.test.ts` and `validators.test.ts`. Every read endpoint recommendation: add a `django_assert_max_num_queries`-style budget test on the backend and a render test for new components.

## Adding a screen

1. Add the file under `src/app/` (route) — keep it thin (~200 lines), compose components from `@/components/ui`.
2. Reuse `SheetHost` for sheets, `StatusView` for loading/empty/error, `useRefresh` + `useConnection` for data and offline.
3. Theme first: add a token in `tokens.js`, read it via className or `useThemeColors()` — never hard-code hex in components.
4. Run `npx tsc --noEmit` (must be clean) and `npm test`.

## Dependencies

`expo`, `expo-router`, `nativewind`, `axios`, `zustand`, `@tanstack/react-query`, `clsx`, `tailwind-merge`, `expo-secure-store`, `expo-blur`, `expo-clipboard`, `expo-haptics`, `expo-image`, `expo-image-picker`, `@react-native-community/netinfo`, `@react-native-community/datetimepicker`, `react-native-safe-area-context`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-svg`, `jest-expo`, `@testing-library/react-native`.

---

Built to be forked. Make it yours.
