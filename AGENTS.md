# AGENTS.md — react-rapido-native (Expo + NativeWind)

Authoritative instructions for AI agents working in the react-rapido-native
mobile template. These rules are mandatory unless a rule explicitly
says otherwise.

This folder is the native replica of **react-rapido** (web). Same
identity and architecture, rebuilt clean-native with Expo + NativeWind.
react-rapido itself is preserved untouched at `../react-rapido` — this
folder is the mobile template for every app.

> The code IS the first impression. Faster, sharper, more alive - or
> reject it. A senior designer and a senior engineer both sign off.

Before changing code, read `README.md` and `migration-progress.md`,
identify the existing implementation (components library second tab
after Home), and inspect the relevant primitive in
`src/components/ui/`. Treat the components library
(`src/app/(tabs)/(showcase)/index.tsx`) as the source of truth for
primitive usage.

## 1. Core principles

1.  **Preserve product behavior.** Make focused changes, preserve
    existing functionality, and avoid unrelated refactoring. When a
    request is scoped to one component or property, edit only that.
2.  **Follow the architecture.** Keep rendering, state, data fetching,
    navigation, and business rules in their established layers.
3.  **The backend is the source of truth.** The app renders and
    collects; it never reconstructs authoritative business state.
4.  **The design system is finished.** Reuse `src/components/ui/`;
    never redefine, re-spec, or fork a primitive.
5.  **Treat API contracts as intentional.** Types, nullability, and
    error shapes must match the backend serializers exactly.
6.  **Test every meaningful change.** Add or update tests and run them;
    never weaken or delete tests to obtain a passing suite.
7.  **Optimize based on evidence.** Prevent needless re-renders and
    requests, bound lists, and measure before optimizing.
8.  **Keep mobile and backend aligned.** Implement the documented user
    journey, including prerequisites, error states, recovery, and
    completion conditions.
9.  **Do not invent product behavior.** If documentation and
    implementation conflict, investigate. If intended behavior remains
    unclear, ask for clarification.

## 2. Repository documentation

Start with `README.md` to understand the template, then
`migration-progress.md` for the web-to-native map.

  ------------------------------------------------------------------------------
  Need                                Source
  ----------------------------------- ------------------------------------------
  Template docs                       `README.md`

  Web-to-native map + port log        `migration-progress.md`

  Components library (live)           `src/app/(tabs)/(showcase)/index.tsx`
                                      (2nd tab after Home)

  UI design system                    `src/components/ui/`

  Sheets                              `src/components/ui/Sheet.tsx`,
                                      `SheetHost.tsx`

  Design tokens                       `src/theme/tokens.js`

  Canonical motion patterns           `src/components/ui/Sheet.tsx`,
                                      `Button.tsx`, `Switch.tsx`,
                                      `WaterCups.tsx`

  Backend contracts                   `src/api/` (typed to backend
                                      serializers); Qoot backend
                                      reference at `../qoot/backend/`
  ------------------------------------------------------------------------------

Read the complete relevant flow, not just a matching heading. Update
documentation whenever implementation changes navigation, API usage,
or component behavior.

## 3. Expo has changed - do not trust your training data

Expo ships breaking changes every SDK release (this template: SDK 57).
Before touching any Expo, EAS, or React Native API:

1.  Read the `expo` version in `package.json`.
2.  Fetch `https://docs.expo.dev/versions/v<major>.0.0/`.
3.  For anything else, fetch `https://docs.expo.dev/llms.txt` and follow
    its links. Never answer from memory.

## 4. Commands

``` bash
npx expo install <package>  # ALWAYS - resolves SDK-compatible versions
npx expo start              # dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose
npm run check               # typecheck + lint + tests (the completion gate)
```

Run `npm run check` before declaring any task done. Use `bunx` instead
of `npx` only if `bun.lock` exists. Run `npx expo-doctor` after any
dependency or config change and resolve what it reports.

## 5. Mobile standards

### 5.1 No hardcoded user-facing text; Arabic and RTL are first-class

Every string a user reads comes from the project's translation system.

-   Add keys for every supported locale in the same change. A missing
    Arabic value is a defect, not a fallback.
-   Never concatenate translated fragments. Use interpolation and
    pluralization.
-   Text that comes from the backend (food names, categories, and so
    on) is already localized by the API. Render it as received; never
    build bilingual pairs on the client.
-   Format dates, numbers, units, and relative times with locale-aware
    formatters.
-   Use logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start`,
    `end`) instead of `left`/`right`. Direction-implying icons (back,
    chevrons, progress, send) mirror in RTL; neutral icons do not.
-   Verify every changed screen in English and in Arabic with RTL
    enabled. Rubik carries both scripts; do not introduce another
    family.

### 5.2 Missing measurements are null, never zero

Mirror the backend rule: `null` means not measured, `0` means a
measured zero.

-   Type measurements as `number | null`.
-   Never coerce missing values to zero when parsing, computing, or
    displaying (`value ?? 0` on a measurement is prohibited).
-   Render missing values through one shared formatter as the
    translated "no data" label.

### 5.3 State ownership

  --------------------------------------------------------------------------
  State                  Owner                        Notes
  ---------------------- ---------------------------- ----------------------
  Auth (user, token ref) Zustand (`src/store/auth`)   In-memory v1; add
                                                      AsyncStorage only to
                                                      persist non-secrets

  Theme                  Zustand                      `src/store/theme/`
                                                      `themeStore.ts` +
                                                      `src/theme/vars.ts`

  Server data            TanStack Query               Cache only

  UI state               `useState`                   Never global

  URL state              Expo Router                  Params and routes
  --------------------------------------------------------------------------

-   Do not compute or cache business results the backend already
    provides (totals, goals, eligibility, subscription state).
-   Never duplicate server data into Zustand or `useState`.
-   Never rely on hidden or disabled UI as access control. The backend
    enforces permissions; the app only reflects them.

### 5.4 Secrets, tokens, and privacy

-   Tokens live only in `expo-secure-store`. Never cookies, never
    localStorage, never plain AsyncStorage.
-   Only `EXPO_PUBLIC_*` variables reach the client, and they are
    public. Never place secrets in them. Never commit `.env`.
-   Never log tokens, personal data, health data, or full payloads.
    No `console.log`.
-   Clear user-scoped stores, query cache, and secure storage on logout
    and on account switch. Scope private query keys to the current
    user.

### 5.5 Styling: NativeWind only

-   **NEVER `StyleSheet.create`.** All styling via `className`
    (NativeWind v4, Babel `jsxImportSource: nativewind`).
-   Web to native map: `div` to `View`; `p`/`h1` to `Text` (ALL text
    inside `<Text>` or it throws); `button`/`a` to `Pressable`
    (`onPress`); `input` to `TextInput` (`value` + `onChangeText`); long
    lists to `FlatList` (`data` + `renderItem`), never `.map()` for
    long data.
-   Flex is always on, default **column**. Unitless dp (`p-4`). No media
    queries: use `useWindowDimensions()` / `Platform`. No
    `position: fixed`: use `absolute` +
    `react-native-safe-area-context`. No CSS animations: Reanimated +
    gesture-handler.
-   Forms: `KeyboardAvoidingView` + `ScrollView`; `SafeAreaView` on
    every screen; theme through tokens, not duplicated `dark:`
    variants.

## 6. Navigation and routing (Expo Router)

-   Routes live in `src/app/`. Every file is a screen; `_layout.tsx` is
    the Stack. Tabbed screens live in `src/app/(tabs)/` with their own
    Tabs layout — Home first, then the components library
    (`(showcase)`) as the second tab. Keep components, hooks, and utils
    OUTSIDE `src/app/`.
-   Use `Link`, `router` (`push` / `replace` / `back`), and
    `useLocalSearchParams` from `expo-router`. No `window.location`.
-   The root `_layout.tsx` owns `QueryClientProvider`, SecureStore token
    preload, Splash, `GestureHandlerRootView` (required for swipe and
    drag), and `SheetHost`. Nothing else.
-   Deep links and restored navigation state must not skip a
    prerequisite gate (auth, onboarding, verification, subscription).
-   Routes are thin orchestrators: hooks, handlers, compose. UI lives in
    `components/`.

## 7. API layer - 3-file pattern (from react-rapido)

``` text
src/api/<domain>/endpoints.ts + hooks.ts + index.ts
```

-   `endpoints.ts`: pure endpoint maps and axios calls.
-   `hooks.ts`: `use<Action>` React Query hooks.
-   `index.ts`: barrel.
-   One shared axios client owns base URL, auth header, language header,
    timeout, 401 handling, and error normalization. Never create
    another HTTP client in a feature.
-   Base URL MUST be absolute: `process.env.EXPO_PUBLIC_API_URL`.
-   401: clear token and `router.replace('/login')` through the shared
    flow only. A screen never implements its own refresh or logout.
-   Every request and response has an explicit TypeScript type matching
    the backend serializer, including nullability. No `any`. Map server
    shapes once, in the API layer.
-   Every mutation has `onError` surfacing `extractErrorMessage`. Never
    a silent `catch {}` in UI. Show backend validation errors next to
    their field where possible.
-   Stable hierarchical query keys that include every parameter the
    result depends on. Invalidate only the affected queries after a
    mutation.
-   State-changing actions (orders, submissions, payments) are guarded
    against double taps and retries, and use backend idempotency where
    it exists. Optimistic updates require a rollback path and must not
    alter authoritative totals without server confirmation.
-   Every collection request is paginated or bounded. Debounce search,
    cancel superseded requests, and ignore stale responses. Respect
    backend caps; never request or render more than the documented
    maximum for diary, library, and recent lists.

## 8. Architecture and code organization

### 8.1 Component architecture

``` text
src/components/
  ui/                     # global design system (never fork)
                          # (Button, Input, Card, Sheet, ...)
  auth/                   # auth screens' components
  landing/                # brand replica
  theme/                  # ModeToggle
  shared/navigation/      # TabBarInsetContext
  <domain>/               # feature domains (add as needed)
  <domain>/Component.tsx + index.ts (barrel)
```

### 8.2 Layer responsibilities

  -----------------------------------------------------------------------
  Layer                               Responsibility
  ----------------------------------- -----------------------------------
  Routes (`src/app/`)                 Thin orchestrators: params, hooks,
                                      handlers, compose. No raw HTTP, no
                                      business rules.

  Components                          UI. Receive data via props. Never
                                      touch store, router, or query
                                      directly.

  Hooks                               Reusable stateful logic and data
                                      access with a clear return
                                      contract.

  API layer (`src/api/`)              Endpoints, types, mapping, error
                                      normalization.

  Stores (`src/store/`)               Client-owned cross-screen state
                                      only (auth, theme).

  Theme (`src/theme/`)                Tokens and CSS-variable plumbing.
                                      The only place raw values live.

  Utilities                           Pure, genuinely reusable helpers.
  -----------------------------------------------------------------------

Cross-feature imports use the other feature's barrel, never its
internals. Avoid circular imports; extract shared dependencies into a
third module.

### 8.3 Readability and maintainability

Every file should be understandable to a new engineer in under two
minutes.

-   **TypeScript strict.** No `any`, no `@ts-ignore`, no `!`
    assertions. `@ts-expect-error` only in tests, with a reason.
-   **Type everything public.** Props, hook returns, function
    signatures. `X | null` for nullable; discriminated unions for
    multi-state results.
-   **No magic numbers or strings.** Descriptive module-level constants
    (`SEARCH_DEBOUNCE_MS`, `MAX_DIARY_ENTRIES`). Raw visual values go
    in `tokens.js`.
-   **No deep nesting.** Guard clauses, early returns, extracted
    components. No nested ternaries in JSX.
-   **Small functions and components.** Functions: soft 40 / hard 60
    lines. Components: soft 150 / hard 250 lines. Modules: soft 300
    lines, one concern.
-   **Function components and hooks only.** A hook does one thing.
-   **Props discipline.** More than five props, or related groups,
    become a typed object or composition. No boolean-prop explosions;
    prefer variants.
-   **Named exports**, except where the router requires default.
-   **No implementation comments.** JSDoc on public API functions only.
    Section headers in complex files are permitted.
-   **No dead code.** Remove unused imports, props, components,
    styles, branches, and commented-out code.
-   **No `console.log`.**
-   **Fail fast.** Validate at boundaries and handle errors
    explicitly. Empty `catch` blocks are prohibited.
-   **Consistent naming.** Components PascalCase, hooks `use*`,
    booleans as predicates (`isLoading`), collections plural.
-   **Clean imports.** Sorted and grouped; use the configured path
    aliases (`@/`). No wildcard imports.

Avoid premature abstractions, wrappers that add no behavior, and
generic frameworks for one-time operations.

### 8.4 Shared code

-   **Reuse before reinventing.** Check `src/components/ui/`,
    `src/components/shared/`, hooks, and utils before writing anything.
-   **Promote, don't duplicate.** If a feature grows a reusable
    primitive, move it to `ui/` or `shared/` and re-import.
-   **Additive, not subtractive.** Do not delete a shared helper only
    because nothing imports it today; remove it only when demonstrably
    dead across the codebase.
-   **`ui/` and `shared/` never import from feature domains.**
-   **Extend, don't fork.** Compose or extend a shared primitive;
    never copy it.

## 9. Design system: component reuse is the hard rule

`src/components/ui/` is a finished design system, not a starting point.
**Every primitive in it is already built, already themed, and already
audited against the components library `(showcase)`.**

-   **Never redefine a primitive.** No new `Button`, `Card`, `Input`,
    `Badge`, `Row`, `Sheet`, `TabBar`, `Chip`, `Switch`, `ProgressBar`,
    `Avatar`, `EmptyState`, or `Modal` inside a feature folder or a
    route. Import it from `@/components/ui`.
-   **Never re-spec a primitive.** Do not hand-write the 52px button
    height, the 1.5px card border, the 44px tap target, the macro
    colours, or the type ramp. Those live in the component or in
    `tokens.js`.
-   **Never re-derive a token.** No raw hex, no `rgba()`, no Tailwind
    palette colour (`bg-orange-500`, `text-gray-600`), no `dark:`
    variant that duplicates a token. If a value is not in `tokens.js`,
    it belongs in `tokens.js` first. Never hardcode HEX outside
    `src/theme/tokens.js`.
-   **Before writing UI, read `src/components/ui/index.ts`.** That
    barrel is the full menu. If something is missing, ADD it to
    `src/components/ui/` (themed, all variants, added to the components library)
    rather than inlining it at the call site.
-   **The components library is the spec.** The library screen renders every
    primitive in every state, mirroring the components library
    one section at a time. A change to a component must be visible
    there; a screen needing something the library does not show is a
    bug in the screen.
-   **Prefer composition over configuration.** Pass a `RecipeCard` or
    `ListRow` a new `sub` string; do not fork it into a
    `RecipeCardCompact`. Extract to a shared primitive only when shape
    and behaviour genuinely match.
-   **Type sizes carry the family and weight.** `text-title`,
    `text-caption`, `text-body`, `text-h1`, `text-metric-lg` already
    resolve to the right Rubik family, size, weight, line height, and
    tracking (`tailwind.config.js` fontSize ramp). Adding
    `font-rubik-bold` next to `text-title` overrides the spec and is a
    bug: `text-title` is 600, not 700.
-   **Icons come from `@/components/ui/icons`.** The barrel maps
    Phosphor-style names to verified Ionicons glyphs. Never import
    icons from a vector-icons root. Pass the glyph to a component's
    `icon` prop; components render it at the themed colour and size.
    For a missing glyph, add a verified Ionicons name to `icons.ts`.

### 9.1 Adding to the system

1.  Add or change the component in `src/components/ui/`, with every
    variant and state the library documents.
2.  Export it from `src/components/ui/index.ts`.
3.  Show it in the library, in the matching section.
4.  If it introduced a new raw value, put it in `src/theme/tokens.js`
    and expose it as a Tailwind token.
5.  Run `npm run check`.

### 9.2 When a screen needs something a component does not have

This is expected. Do not inline it, do not fork it, do not wrap it in a
screen-local component.

1.  **Stop and ask the user which existing component should carry the
    change.** Present the candidates from `src/components/ui/` and say
    what the difference is. Do not pick for them.
2.  Once they choose, **change that component** so every screen using
    it gets the new behaviour. A component only exists once.
3.  Show the change in the library, in the same section.
4.  If the change would alter how an existing screen looks, say so
    explicitly before making it.
5.  Run `npm run check`.

If the right home is genuinely a new component, say so and let the user
confirm before creating it.

### 9.3 Building a screen

The components library (`src/app/(tabs)/(showcase)/index.tsx`) is the
source of truth for primitive usage. Work one screen at a time.

1.  **Analyse before writing code.** Post a mapping: every region of the
    screen to the primitive from `src/components/ui/` that carries it,
    marked **reuse as-is**, **needs a change**, or **missing**. Name
    the exact props and glyphs the screen needs, and call out any
    existing primitive that does not match the design.
2.  **Stop and wait for explicit approval.** No route, no scaffold, no
    data until the mapping is approved.
3.  **For "needs a change", use 9.2.** Name the candidate and every
    existing screen it affects; the user picks which component carries
    it. For "missing", propose a new primitive plus its library section
    and wait for confirmation. New glyphs go in `icons.ts`.
4.  **Then build that one screen.** The route is a thin orchestrator; UI
    lives in `src/components/` next to the domain that owns it.
    Use
    mock data only when there is no endpoint, shaped like the real
    response, and every data region still owns all four states.
5.  Show new or changed primitives in the library, then run
    `npm run check`.
6.  Do not start the next screen until the current one is reviewed.

## 10. Colors are CSS variables, and the split is not negotiable

Semantic colors become CSS variables so one `dark` class on the root
flips the whole app. Two forms are emitted, and which one applies is
decided by `isDirectColor` in `tokens.js`, never by the value in hand:

-   **Opaque colors** are stored as `R G B` triplets so Tailwind's
    `/opacity` modifier works, and emit
    `rgb(var(--color-x) / <alpha-value>)`. This is the only form that
    has ever worked on native; do not "modernise" it to
    `rgba(var(--color-x), 1)`, which changes nothing visible on native
    and breaks it.
-   **Alpha-bearing colors** (the `*-bg` status tints, `scrim`,
    `primary-tint`) are stored verbatim and emitted as a bare
    `var(--color-x)`, because they carry their own alpha.

The trap: `success-bg` and its siblings are **opaque hex in light and
translucent `rgba()` in dark**. `isDirectColor` returns true if *either*
scheme is rgba, so those names are emitted whole in both schemes.
Checking the value in hand instead stores a bare triplet for the light
scheme, and a bare `227 247 236` is not a color React Native can parse,
so every badge, alert, and banner background silently vanishes in light
mode while dark looks fine.

Never store channels for a name that is emitted whole, and never emit a
bare `var(--color-x)` for a name that is emitted as `rgb(...)`.

## 11. Motion and interaction: follow modern platform practice

Read `src/components/ui/Sheet.tsx`, `Button.tsx`, `Switch.tsx`, and
`WaterCups.tsx` before writing any motion. They are the reference for
every rule below. Canonical patterns: `src/app/(tabs)/(showcase)/index.tsx`.

### 11.1 Tooling and gating

-   **Reanimated, not core `Animated`, and never `PanResponder`.**
    Gestures use `react-native-gesture-handler`. Shared values are read
    and written with `.get()` / `.set()` so the React Compiler can see
    them. `scheduleOnRN` (from `react-native-worklets`) replaces the
    deprecated `runOnJS`.
-   **Gate every animation on `useReducedMotion()`** and ship the gate
    with the animation, not after.
-   **Never `setState` from a gesture or scroll handler**, and never
    read or write a shared value during render.
-   **Change only what was asked.** A request scoped to one component or
    property edits only that; a shared primitive or build config is not
    an invitation to modernise it.

### 11.2 Timing, curves, and what to animate

-   **Spring only when a finger was involved.** Springs carry velocity
    through an interruption; timing curves restart. Two-position
    toggles (switch, check, radio, press) use `withTiming` in
    100-200ms with `Easing.bezier(0.23, 1, 0.32, 1)`. A bouncy spring
    on a toggle reads as a defect.
-   **Curves:** entering or exiting `EASE_OUT`; on-screen movement
    `Easing.bezier(0.77, 0, 0.175, 1)`; sheets
    `Easing.bezier(0.32, 0.72, 0, 1)`. Never `Easing.in` on UI.
    `withTiming` uses `Easing.bezier(...)`; Reanimated CSS styles use
    `cubicBezier(...)`. Reanimated 4 rejects raw `'cubic-bezier(...)'`
    strings.
-   **Durations:** press 100-150ms, toggle or chip 150-200ms, sheet
    ~260ms in / ~220ms out. Mobile UI stays under 300ms.
-   **Animate `transform` and `opacity` only.** Never `width`,
    `height`, `padding`, `margin`, or `flex` on a laid-out node. The one
    exception is an absolutely positioned childless element (a bar
    fill, a cup fill), which is out of flow.
-   **Never `scale(0)`, and never `opacity: 0` alone on an entrance.**
    Start at `scale(0.95)` with a fade.
-   **Everything is interruptible and reversible.** Drag, press, and
    toggle read their current animated value before starting, so
    reversing mid-flight never jumps.
-   **Every state change is animated. Nothing snaps.** If you are
    writing a conditional class that swaps a background, border, or
    checkmark, drive it from a shared value with `withTiming` instead.
-   **Know when not to animate.** The frequency gate is real: a chip
    filter, badge, or row highlight is touched a few times a minute,
    and a tint change on those reads as flicker. Use a static style
    swap and keep the press scale. Reserve real motion for sheets, the
    ring, drags, and entrances.
-   **Do not interpolate several colours for one state change.** Each
    animated instance is a per-frame colour conversion. Crossfade one
    layer: keep the resting state static and fade the whole changed
    look over it. One opacity beats three `interpolateColor`s.
-   **An animation must be able to finish.** `Modal` unmounts its
    children the instant `visible` flips, so `entering` / `exiting` is
    thrown away unread. Never drive a sheet, modal, toast, or popover
    off `Modal`'s `visible`. Render an absolute overlay that stays
    mounted, drive it from one shared value, and toggle
    `pointerEvents`. The same applies to any component that returns
    `null` when closed.

### 11.3 Sheets, modals, and toasts

-   **One sheet, one modal, one picker.** `Sheet` and `SheetPicker` are
    the only ones; `Select` opens `Sheet`. If a sheet is really its own
    screen, use `presentation: 'formSheet'` and get the platform's real
    sheet.
-   **Sheets are mounted at the root, and every presentation gets a
    fresh key.** An `absolute` overlay fills its nearest `View` parent,
    so a sheet rendered next to a field fills that field's group
    instead of the screen. Every sheet goes through `SheetHost` in the
    root layout via `useSheet()`. The surface is `SheetSurface`, which
    animates itself out and only then calls `onClosed`. The host keys
    the surface by an `epoch` that bumps only when the sheet fully
    closes. Never use `Modal` for in-screen UI, and never render a
    `SheetSurface` inline.
-   **A sheet is a stack of steps, not a slot.** `present` opens or
    moves forward one step, `back` returns and reverses the slide,
    `replace` swaps the step in place with no way back, `dismiss`
    closes. Use `present` / `back` for a task the user can undo, and
    `replace` only when there is nowhere back to. Never `present` one
    step over another expecting it to reopen: that closes the sheet and
    replays the entrance.
-   **A toast is never on screen until something asks for it.** A
    closed `Toast` renders nothing and unmounts only after its exit
    animation has finished. Never give it `entering` / `exiting`: they
    are layout animations, they fight the animated style for `opacity`
    and `transform`, and Reanimated warns it may overwrite them.
-   **Drag is one-directional where the design says so.** A sheet is
    dragged down to dismiss and refuses an upward drag outright rather
    than resisting it.

### 11.4 Controls and press feedback

-   **One control, one behaviour.** `Tabs` is `Segmented`; there is no
    second tab treatment. A sliding pill is driven by the *active*
    item's own measured frame and stays invisible until every item has
    reported, so it never lands on a neighbour or flashes on first
    paint.
-   **No hover, no `active:opacity`.** Those multiply with a crossfade
    and read as flicker. Press is a 3% scale driven from the same
    shared value.
-   **Press feedback is a transform plus a colour,** never a layout
    jump, and never a box shadow meaning "pressed". `hitSlop` and
    `pressRetentionOffset` keep a small visual with a 44dp target.
-   **One press edge, defined once.** `PressEdge` owns the resting depth
    and corner rounding for `Button`, `Fab`, and the `TabBar` centre.
    Put it first inside a container that reserves `PRESS_EDGE_HEIGHT`
    of bottom padding, with `inset-x-0` so its width is exactly the
    button's. Never hand-write an edge or a `border-bottom` for a press
    state.
-   **Text inputs are centred by their frame, not by themselves.** The
    wrapper owns the surface, border, radius, and focus halo; the
    `TextInput` is a transparent child with `paddingVertical: 0`,
    `textAlignVertical: 'center'`, `includeFontPadding: false`, and
    `underlineColorAndroid="transparent"`. A text input that owns its
    own fixed height does not centre reliably across platforms.
-   **Scrollable content is a `FlatList`** inside a bounded, shrinkable
    parent (`min-h-0 flex-1`), so it scrolls instead of overflowing.

## 12. Screens, not just screens

-   **Every screen owns all four data states.** `StatusView` renders
    loading (skeleton shaped like the screen, never a spinner), empty,
    error, and offline (`OfflineSkeleton` + `Banner`). A screen with
    only a happy path is unfinished.
-   **Loading is never a bare spinner.** Use `Skeleton` with the
    `line` / `thick` / `block` / `circle` variants.
-   **Destructive actions are reversible or confirmed.** `Toast` with
    an `actionLabel` (Undo, five seconds) for anything a tap can undo;
    an explicit confirm for anything it cannot. Never delete on a
    gesture alone: `DragRow` reveals a Delete button and the tap
    confirms.
-   **Long lists use `FlatList`.** `.map()` is only for short fixed sets
    (chips, week days, cup counts, macro bars). `SheetPicker` and
    `Select` are `FlatList`s for exactly this reason.
-   **Numbers are real and tabular.** Every changing number gets
    `numeric`. Units sit with the value (`230` over `kcal`), never in a
    middot run.
-   **Tappable things answer the pointer.** Press feedback is a
    translate plus a collapsing `border-bottom` edge, never a shadow.
    Nothing is a silent tap.
-   Also handle: validation errors, expired sessions,
    permission-denied and blocked-prerequisite states, duplicate taps,
    interrupted requests, `null` measurements, long Arabic text, and
    state restoration on return or relaunch.

## 13. Identity

`RR // 01`, violet `#8B5CF6`, mono type, `RAW // CLEAN // SOLID`.
All color, spacing, radius, type, elevation, and motion values live
in `src/theme/tokens.js` (the only file allowed to hold raw values).
Everything else consumes semantic Tailwind classes (`bg-surface`,
`text-text-2`, `border-border-strong`, `bg-primary`, `text-on-primary`,
`shadow-l1`, `rounded-xl`, `p-s6`).

Light and dark flip via the Zustand theme store
(`src/store/theme/themeStore.ts` + `useResolvedScheme()`), not
`useColorScheme` directly.

Icon and splash: `assets/images/logo.png` (copied from react-rapido
`public/logo.png`). `app.json`: `react-rapido-native`, scheme
`rapidonative`.

## 14. Device and platform rules

-   **Touch.** 44pt minimum targets; bottom tabs in the thumb zone;
    `Pressable` for all taps; `expo-haptics` (`selectionAsync` on tab
    switches, `impactAsync` on commits). Never silent taps.
-   **Safe areas.** Screens inside tabs use
    `edges={['top','left','right']}` (the bar owns `bottom`); standalone
    screens keep all edges. Content never hides behind the floating bar
    (keep ~120px bottom clearance).
-   **Keyboard.** Every form: `KeyboardAvoidingView` + `ScrollView` +
    `SafeAreaView`. Test on a small phone, not just a simulator.
-   **Platforms differ.** Handle keyboard, back button, status bar,
    haptics, and permissions per platform; keep `Platform` branches
    few and in one place.
-   **Permissions.** Every permission has an accurate, translated usage
    description, is requested only when needed, and has a defined
    denied-state fallback.
-   **Ship config.** `app.json` owns `userInterfaceStyle`,
    `backgroundColor`, `scheme`, icons, splash, and adaptive icons. No
    environment-specific values hardcoded in source.

## 15. Performance

-   Virtualize every list that can grow, with a stable ID-based
    `keyExtractor` (never an index). Keep list items pure, memoized, and
    given stable props.
-   No heavy computation in render. Subscribe to the smallest slice of
    state needed. Do not store derived state; compute it.
-   Use `memo`, `useMemo`, and `useCallback` where profiling or list
    stability justifies them, not by default. The React Compiler is in
    use: follow its rules rather than hand-memoizing around it.
-   No duplicate requests for the same data; share queries through the
    data layer. Prefetch only when the documented flow makes the next
    screen near-certain. Ask for backend support rather than stitching
    many calls together on the client.
-   Images: explicit sizing and caching, appropriately sized sources,
    never full-resolution assets for thumbnails.
-   Animations run on the UI thread. Do not block the JS thread during
    startup, transitions, or scrolling; defer non-critical work.
-   Lazy-load heavy screens and modules. Justify every new dependency
    for bundle size, maintenance, and SDK compatibility; do not add a
    package for a small utility.
-   Profile before optimizing (React DevTools Profiler, perf monitor,
    Hermes tooling), and verify the change preserves behavior.

## 16. Accessibility

-   Every interactive element has a role, a translated label, and a
    correct state (disabled, selected, busy, checked).
-   Everything tappable is 44dp minimum. Progress and steppers expose
    `progressbar` / `adjustable` with their values.
-   Text scales with the system font size; layouts must not clip or
    overlap at large sizes.
-   Color is never the only carrier of meaning; meet contrast in light
    and dark.
-   Support VoiceOver and TalkBack with logical focus order, and
    announce errors, loading, and results.
-   Forms announce errors, associate them with their field, and manage
    focus after a failed submit.

## 17. Product flows and end-to-end consistency

Features are parts of user journeys, not isolated screens.

### 17.1 Understand the journey first

-   Read `README.md`, the components library, and the relevant feature components.
-   Trace the real path: route, screen, hook, API call, backend
    serializer, service, and back to the UI.
-   Treat documented flows as the source of truth. If documentation
    conflicts with implementation, investigate before changing either.

### 17.2 Preserve the complete journey

Preserve the documented order of steps; navigation destinations, back
behavior, entry and exit points; prerequisites and gates
(authentication, verification, onboarding, permissions, profile
completion, subscription); user input across navigation, retries,
backgrounding, and relaunch where required; and the actual completion
conditions. Never mark a flow complete early or from local state alone.

### 17.3 Keep mobile and backend aligned

-   Mobile inputs match backend serializer fields, types, and
    validation. Client validation is a convenience, never enforcement.
-   Use API responses as provided; never guess or rebuild server state.
-   Trigger analytics and side effects only after the operation
    succeeds.
-   When a feature needs a backend change, say so explicitly. Do not
    work around a missing contract with client-side hacks.

### 17.4 Shared dependencies and documentation

-   Before changing a shared component, hook, store, route, or API
    function, identify every dependent screen and flow, and verify none
    breaks. Check the impact before changing global navigation,
    providers, theme, or shared state.
-   Document every new journey in `README.md` and the components
    library. Update those when steps, navigation, prerequisites, API
    usage, completion conditions, or error handling change. Never
    document behavior the implementation does not support.

## 18. Testing standards

Testing is mandatory. A feature is not complete because it renders in
the simulator.

-   Use the project's configured test runner (`npm run check` runs it).
    Query by role, label, or visible text; use `testID` only when no
    accessible query exists. No snapshot-only tests.
-   Every new feature has tests for expected behavior; every bug fix has
    a regression test where practical. Update affected tests when
    changing behavior.
-   Reuse existing render helpers, providers, and mock factories. Mock
    only system boundaries (network, native modules, time, storage).
-   Never delete, skip, or weaken tests to get a passing suite.

What to cover:

-   **Utilities and formatters:** boundaries; `null` renders as "no
    data" and never as zero; English and Arabic formatting.
-   **Hooks and API layer:** mapping, each error type, 401 handling,
    query-key scoping, invalidation, duplicate-submission protection.
-   **Components and screens:** loading, empty, error, offline, and
    disabled states; interactions; validation messages; accessibility
    roles and labels; English, Arabic, and RTL.
-   **Journeys:** entry to completion, blocked prerequisites, retry and
    recovery, restoration after backgrounding.
-   **Security and isolation:** no secrets logged or stored insecurely;
    logout clears user-scoped data.
-   **Library:** a new or changed `ui/` primitive appears in the library
    in every state.

After implementation: run `npm run check`; run relevant journey tests;
investigate failures rather than assuming they are unrelated; report
any check you could not run and why.

## 19. Building with EAS

Cloud builds, signing, and submit (`eas build` / `eas submit`) plus OTA
(`eas update`). Run the CLI as `npx eas-cli@latest <cmd>` (or `bunx` if
bun). Release through TestFlight and the Play internal track.

-   Never hand-create `ios/` or `android/`. CNG via `app.json` and
    config plugins only.
-   Expo Go supports bundled modules only; custom native code needs a
    dev build.
-   Changes that need a new native build (new native modules,
    permissions, config plugin changes, SDK upgrades) must be called
    out explicitly. Pure JavaScript changes must remain compatible with
    the production runtime version so OTA stays safe.

## 20. Definition of Done

### Before implementation

-   [ ] Read `README.md` and the components library entries for the change.
-   [ ] Read the relevant library sections and `src/components/ui/index.ts`.
-   [ ] Inspect related routes, hooks, API calls, stores, and backend
    endpoints.
-   [ ] Identify affected shared components and dependent flows.
-   [ ] Confirm the change does not duplicate existing functionality.
-   [ ] For a new screen: mapping posted and approved (9.3).

### During implementation

-   [ ] Follow layer boundaries; routes stay thin.
-   [ ] Reuse `src/components/ui/`; no redefined primitives or raw
    values.
-   [ ] Strict types; contracts match the backend; nullability intact.
-   [ ] All strings localized, RTL verified.
-   [ ] All four data states, plus validation, auth, and permission
    states.
-   [ ] State-changing actions guarded against duplicates.
-   [ ] Motion follows section 11 and is gated on `useReducedMotion()`.
-   [ ] Accessibility requirements met.
-   [ ] Existing functionality preserved; flow docs updated.

### Testing

-   [ ] Meaningful tests added or updated, including failure and
    blocked paths.
-   [ ] Library updated for any changed primitive.
-   [ ] `npm run check` passes; failures investigated.

### Final review

-   [ ] Review the complete diff; no unrelated files changed.
-   [ ] No unused code, imports, styles, hex values, or `console.log`.
-   [ ] Dependencies installed via `npx expo install`; `npx expo-doctor`
    clean.
-   [ ] Native build needed vs OTA-safe is stated.
-   [ ] Documentation matches the implementation.

## 21. Completion report

When completing a task, provide a concise report containing:

1.  **Changes:** What was implemented or modified.
2.  **Architecture and API:** Structural, navigation, or contract
    changes, and any required backend changes.
3.  **Design system:** Primitives added or changed, and the library
    sections updated.
4.  **Localization and accessibility:** Strings added per locale, and
    RTL and accessibility notes.
5.  **Tests added or updated:** The relevant coverage.
6.  **Checks executed:** Commands run and their actual results,
    including failures.
7.  **Release impact:** New native build required, or OTA-safe.
8.  **Remaining work:** Limitations, skipped checks, or follow-up work.

Never claim checks passed unless they were executed successfully. Never
claim a feature is fully verified when important checks were skipped.

## 22. Intentionally dropped from web

`SeoUpdater`, `index.css` tokens, `@font-face` woff2, WebGL bits
(`ogl` / `three` / GSAP shaders), and web perf metrics (LCP / CLS / TBT)
are not native-portable. The theme is NativeWind `dark:` classes +
system fonts + the Zustand theme store (`src/store/theme/`); raw
values live only in `src/theme/tokens.js`.