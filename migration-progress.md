# migration-progress.md — react-rapido → react-rapido-native

Source: `../react-rapido` (React 19 + Vite + Tailwind v4, preserved untouched).
Target: this folder (`new-app`, Expo SDK 57 + Expo Router + NativeWind v4 + Babel + Metro).
Goal: exact native replica of react-rapido identity, as reusable mobile template `react-rapido-native`.
Method: `expo-web-to-native` skill, steps 1–6. User override: clean native only, NativeWind `className`, no `StyleSheet`, no `'use dom'` webviews.

## 1. Assess — screens vs backend

Backend stays deployed. Native app is HTTP client to same API (`EXPO_PUBLIC_API_URL`).
No RSC, no server actions, no ORM in client. Auth moves from cookie/localStorage to SecureStore bearer token (false-friends: Storage + Networking).

Web routes in react-rapido (`src/App.tsx`, `src/lib/constants.ts` ROUTES):
- `/` Home → LandingPage → nativize-now (brand showcase, hot)
- `/login` → nativize-now
- `/register` → nativize-now
- `/forgot-password` → nativize-now
- `/verify-otp` → nativize-now
- `/reset-password` → nativize-now

No port-as-is DOM screens. No nativize-later. All 6 are nativize-now, one per pass.

## 2. Portable as-is (pure TS/React, copy)

- `src/lib/utils.ts` cn() (clsx + tailwind-merge)
- `src/lib/validators.ts` validateEmail/validatePassword/validateName
- `src/hooks/useDebounce.ts`
- `src/types/auth.ts`, `src/types/user.ts`
- `src/lib/queryClient.ts` (TanStack defaults)

Needs `clsx`, `tailwind-merge`, `@tanstack/react-query` in target (see §6).

## 3. Adapt (same API, native internals)

- `src/lib/constants.ts`: `import.meta.env.VITE_*` → `process.env.EXPO_PUBLIC_*`, ROUTES `/login` → `/login` expo-router paths (file-based, no leading `/` in href).
- `src/api/axiosInstance.ts`: localStorage → `expo-secure-store` (async get/set), `window.location.href='/login'` → `router.replace('/login')`, absolute base URL required, no CORS.
- `src/store/auth/authStore.ts`: zustand persist localStorage → in-memory for v1 (add `@react-native-async-storage/async-storage` later for persist).
- `src/api/<domain>/endpoints.ts`: copy verbatim (pure axios paths).
- `src/api/<domain>/hooks.ts`: copy, keep `extractErrorMessage` onError.

## 4. Rewrite native (no copy)

Per false-friends + native-patterns, NativeWind only:
- `components/ui/*` (button/input/card/badge/label) → `Pressable` + `Text` + `TextInput` + `View`, `onPress`, `onChangeText`, all text inside `<Text>`.
- `components/auth/*` (AuthLayout/FormError/FormDivider/OAuthButtons/PasswordStrength) → `SafeAreaView` + `KeyboardAvoidingView` + `ScrollView`.
- `components/landing/LandingPage.tsx` (355 lines, brutalist cards, marquee `@keyframes`) → single-column native: brand header, hero, spec table, stack list. No marquee animation (or Reanimated later), no `hover:`, no `grid`, flex-column default, `useWindowDimensions` for breakpoints.
- `MainLayout` skip-link + `SeoUpdater` + `index.css` tokens → drop (web-only). Theme via `src/constants/theme.ts` + NativeWind `dark:` + `useColorScheme`.
- `components/bits/*` (ogl/three/GSAP WebGL) → skip v1, not native-portable.

## 5. Identity / assets

- `react-rapido/public/logo.png` → `new-app/assets/images/logo.png`, wire `app.json` icon + splash, rename `name: react-rapido-native`, `slug: react-rapido-native`, `scheme: rapidonative`.
- Brand: `RR // 01`, violet `#8B5CF6`, mono headings, `RAW // CLEAN // SOLID` footer.
- Fonts: no `@font-face` woff2 loading on native; use system + `expo-font` later. Keep font naming tokens only.

## 6. Deps to add (user runs `npx expo install`, NOT done by agent)

`axios`, `zustand`, `@tanstack/react-query`, `clsx`, `tailwind-merge`, `expo-secure-store`.

## 7. Verify (skill: verify-by-running)

`expo export` proves bundle only. Per skill, compare running web route vs running native route for content/behavior parity (not pixels — native should look more native). Tools `agent-browser` + `argent` are install-gated; do NOT install without separate approval. Manual Expo Go check by user for v1.

## Progress

- [x] Assess + worklist (this file)
- [ ] Scaffold shell (app.json identity, _layout Stack, theme, tabs removal)
- [ ] Port §2 + §3 pure/adapted files
- [ ] Rewrite §4 UI primitives + auth components
- [ ] Build Home + 5 auth screens
- [ ] Typecheck/lint by user (`npx tsc --noEmit`, `npx expo lint`)
