/**
 * Rapido design tokens - the single source of truth for the app theme.
 *
 * Rapido styling: RR // 01, violet #8B5CF6, mono type, RAW // CLEAN // SOLID.
 * Brand palette is Tailwind violet (500 #8B5CF6 / 600 #7C3AED) with zinc
 * neutrals. This is the ONLY file allowed to hold raw values (hex / rgba).
 * Everything else imports from here.
 *
 * CommonJS on purpose: `tailwind.config.js` requires it and TS imports it
 * (`allowJs` + `esModuleInterop` are enabled in the Expo tsconfig).
 */

const HEX = /^#([0-9a-fA-F]{6})$/

/** Convert `#RRGGBB` to a space separated RGB channel string for CSS vars. */
function rgbTriplet(value) {
  const match = HEX.exec(String(value).trim())
  if (!match) return null
  const n = parseInt(match[1], 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/* ---------------------------------------------------------------- colors -- */

const color = {
  light: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-2': '#FAFAFA',
    'surface-3': '#F4F4F5',
    text: '#18181B',
    'text-2': '#52525B',
    'text-3': '#A1A1AA',
    border: '#E4E4E7',
    'border-strong': '#D4D4D8',
    track: '#F4F4F5',

    primary: '#8B5CF6',
    'primary-hover': '#A78BFA',
    'primary-edge': '#6D28D9',
    'on-primary': '#FFFFFF',
    'primary-text': '#6D28D9',
    'primary-tint': 'rgb(237, 233, 254)',
    'primary-tint-2': 'rgba(237, 233, 254, 0.64)',

    success: '#10B981',
    'success-edge': '#059669',
    'success-bg': '#ECFDF5',
    'success-text': '#047857',
    warning: '#F59E0B',
    'warning-bg': '#FFFBEB',
    'warning-text': '#B45309',
    error: '#F43F5E',
    'error-edge': '#E11D48',
    'error-bg': '#FFF1F2',
    'error-text': '#BE123C',
    info: '#3B82F6',
    'info-bg': '#EFF6FF',
    'info-text': '#1D4ED8',

    inverse: '#18181B',
    'on-inverse': '#FFFFFF',

    protein: '#10B981',
    carbs: '#F59E0B',
    fat: '#F43F5E',
    water: '#3B82F6',
    sugar: '#8B5CF6',
    fiber: '#84CC16',

    'tint-orange': '#F5F3FF',
    'tint-green': '#ECFDF5',
    'tint-yellow': '#FFFBEB',
    'tint-sky': '#EFF6FF',
    'tint-berry': '#FDF2F8',
    'tint-orange-t': '#5B21B6',
    'tint-yellow-t': '#B45309',

    'success-knob': '#064E3B',
    'toast-action': '#C4B5FD',
    scrim: 'rgba(0, 0, 0, 0.32)',
  },

  dark: {
    bg: '#09090B',
    surface: '#18181B',
    'surface-2': '#27272A',
    'surface-3': '#3F3F46',
    text: '#FAFAFA',
    'text-2': '#A1A1AA',
    'text-3': '#71717A',
    border: '#27272A',
    'border-strong': '#3F3F46',
    track: '#27272A',

    primary: '#A78BFA',
    'primary-hover': '#C4B5FD',
    'primary-edge': '#7C3AED',
    'on-primary': '#2E1065',
    'primary-text': '#C4B5FD',
    'primary-tint': 'rgb(76, 29, 149)',
    'primary-tint-2': 'rgba(76, 29, 149, 0.64)',

    success: '#34D399',
    'success-edge': '#059669',
    'success-bg': 'rgba(52, 211, 153, 0.10)',
    'success-text': '#6EE7B7',
    warning: '#FBBF24',
    'warning-bg': 'rgba(251, 191, 36, 0.10)',
    'warning-text': '#FCD34D',
    error: '#FB7185',
    'error-edge': '#E11D48',
    'error-bg': 'rgba(251, 113, 133, 0.10)',
    'error-text': '#FDA4AF',
    info: '#60A5FA',
    'info-bg': 'rgba(96, 165, 250, 0.10)',
    'info-text': '#93C5FD',

    inverse: '#FAFAFA',
    'on-inverse': '#18181B',

    protein: '#10B981',
    carbs: '#F59E0B',
    fat: '#F43F5E',
    water: '#3B82F6',
    sugar: '#8B5CF6',
    fiber: '#84CC16',

    'tint-orange': '#2E1065',
    'tint-green': '#064E3B',
    'tint-yellow': '#451A03',
    'tint-sky': '#1E3A8A',
    'tint-berry': '#500724',

    'tint-orange-t': '#DDD6FE',
    'tint-yellow-t': '#FCD34D',

    'success-knob': '#022C22',
    'toast-action': '#C4B5FD',
    scrim: 'rgba(0, 0, 0, 0.72)',
  },
}

/* ------------------------------------------------------------ brand scales -- */
/* Static, theme independent. Violet is the rapido brand scale. */

const scales = {
  violet: {
    50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
    500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95',
    950: '#2E1065',
  },
  // Legacy Qoot key kept as an alias so existing `scales.orange` callers
  // resolve to rapido violet rather than orange.
  orange: {
    50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
    500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95',
  },
  green: {
    50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
    500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B',
  },
  yellow: {
    50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24',
    500: '#F59E0B', 600: '#D97706', 700: '#B45309',
  },
  berry: {
    50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185',
    500: '#F43F5E', 600: '#E11D48', 700: '#BE123C',
  },
  sky: {
    50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
    500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
  },
  zinc: {
    0: '#FFFFFF', 50: '#FAFAFA', 100: '#F4F4F5', 200: '#E4E4E7', 300: '#D4D4D8',
    400: '#A1A1AA', 500: '#71717A', 600: '#52525B', 700: '#3F3F46', 800: '#27272A',
    900: '#18181B', 950: '#09090B',
  },
  // Legacy cocoa key kept as an alias to the zinc neutral scale.
  cocoa: {
    0: '#FFFFFF', 50: '#FAFAFA', 100: '#F4F4F5', 200: '#E4E4E7', 300: '#D4D4D8',
    400: '#A1A1AA', 500: '#71717A', 600: '#52525B', 700: '#3F3F46', 800: '#27272A',
    900: '#18181B',
  },
}

/* ----------------------------------------------------------------- spacing -- */

const spacing = {
  s1: 2, s2: 4, s3: 8, s4: 12, s5: 16, s6: 20,
  s7: 24, s8: 32, s9: 40, s10: 48, s11: 64,
}

/* ------------------------------------------------------------------ radius -- */

const radius = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 28, full: 9999,
}

/* ------------------------------------------------------------- border width -- */
/* The design hairline. Tailwind's default `border` is 1px, which is thinner
 * than the 1.5px this design uses everywhere, so the default is overridden. */

const borderWidth = {
  hairline: 1.5,
}

/* -------------------------------------------------------------- typography -- */
/* Weights map to the loaded Rubik families (Rubik_400Regular ...
 * Rubik_800ExtraBold). Layout-only: color is applied by the consumer
 * (see the Text primitive) so it stays theme aware. */

const fontFamily = {
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  semiBold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
  extraBold: 'Rubik_800ExtraBold',
}

const typography = {
  // Tailwind defaults
  xs: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  sm: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  base: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  lg: { fontFamily: fontFamily.regular, fontSize: 18, lineHeight: 28, letterSpacing: 0 },
  xl: { fontFamily: fontFamily.regular, fontSize: 20, lineHeight: 28, letterSpacing: 0 },
  '2xl': { fontFamily: fontFamily.regular, fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  '3xl': { fontFamily: fontFamily.regular, fontSize: 30, lineHeight: 36, letterSpacing: 0 },
  '4xl': { fontFamily: fontFamily.regular, fontSize: 36, lineHeight: 40, letterSpacing: 0 },
  '5xl': { fontFamily: fontFamily.regular, fontSize: 48, lineHeight: 48, letterSpacing: 0 },
  '6xl': { fontFamily: fontFamily.regular, fontSize: 60, lineHeight: 60, letterSpacing: 0 },
  '7xl': { fontFamily: fontFamily.regular, fontSize: 72, lineHeight: 72, letterSpacing: 0 },
  '8xl': { fontFamily: fontFamily.regular, fontSize: 96, lineHeight: 96, letterSpacing: 0 },
  '9xl': { fontFamily: fontFamily.regular, fontSize: 128, lineHeight: 128, letterSpacing: 0 },

  // Rapido semantic styles
  display: { fontFamily: fontFamily.extraBold, fontSize: 46, lineHeight: 54, letterSpacing: -0.92 },
  h1: { fontFamily: fontFamily.bold, fontSize: 37, lineHeight: 45, letterSpacing: -0.74 },
  h2: { fontFamily: fontFamily.bold, fontSize: 31, lineHeight: 39, letterSpacing: -0.62 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 25, lineHeight: 33, letterSpacing: 0 },
  title: { fontFamily: fontFamily.bold, fontSize: 23, lineHeight: 30, letterSpacing: 0 },
  bodyLg: { fontFamily: fontFamily.regular, fontSize: 22, lineHeight: 32, letterSpacing: 0 },
  body: { fontFamily: fontFamily.regular, fontSize: 19, lineHeight: 28, letterSpacing: 0 },
  caption: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 23, letterSpacing: 0 },
  label: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22, letterSpacing: 0 },
  metricXl: { fontFamily: fontFamily.bold, fontSize: 62, lineHeight: 68, letterSpacing: -1.24 },
  metricLg: { fontFamily: fontFamily.bold, fontSize: 45, lineHeight: 51, letterSpacing: -0.9 },
  metricMd: { fontFamily: fontFamily.semiBold, fontSize: 31, lineHeight: 39, letterSpacing: -0.62 },
}

/* ---------------------------------------------------------------- elevation -- */

const shadow = {
  light: {
    l1: '0 2px 8px rgba(139, 92, 246, 0.06)',
    l2: '0 8px 24px rgba(139, 92, 246, 0.10)',
    l3: '0 20px 48px rgba(139, 92, 246, 0.18)',
  },
  dark: {
    l1: '0 2px 8px rgba(0, 0, 0, 0.30)',
    l2: '0 8px 24px rgba(0, 0, 0, 0.40)',
    l3: '0 20px 48px rgba(0, 0, 0, 0.50)',
  },
}

/* ------------------------------------------------------------------ motion -- */

const motion = {
  fast: 120,
  base: 220,
  slow: 420,
  ease: [0.2, 0.7, 0.2, 1],
  pop: [0.34, 1.56, 0.64, 1],
}

/* ------------------------------------------------------------------ layout -- */

const layout = {
  pad: 20,
  gap: 16,
  section: 24,
  tap: 44,
  tabbar: 64,
}

/* ---------------------------------------------------------------- z-index -- */

const zIndex = {
  chrome: 1, tabbar: 2, scrim: 3, sheet: 4, toast: 5, island: 6,
}

/* ------------------------------------------------------- CSS variable maps -- */
/* Semantic colors become CSS variables so a single className switches theme.
 *
 * Opaque colors are stored as `R G B` triplets so Tailwind's `/opacity` modifier
 * works; alpha-bearing colors are stored verbatim, because they are emitted whole
 * as `var(--color-x)` and a bare triplet is not a color React Native can parse.
 *
 * The check must be `isDirectColor`, not the value in hand: `success-bg` and its
 * siblings are opaque hex in light and translucent `rgba()` in dark, so deciding
 * per value stored a bare triplet for the light scheme and every badge, alert and
 * banner background silently vanished there. */

function colorVars(scheme) {
  const out = {}
  for (const [name, value] of Object.entries(color[scheme])) {
    out[`--color-${name}`] = isDirectColor(name) ? value : rgbTriplet(value) || value
  }
  for (const [level, value] of Object.entries(shadow[scheme])) {
    out[`--shadow-${level}`] = value
  }
  return out
}

/** Names whose value is (or can be) an rgba color -> cannot take `/alpha`. */
function isDirectColor(name) {
  return String(color.light[name]).startsWith('rgba') || String(color.dark[name]).startsWith('rgba')
}

module.exports = {
  rgbTriplet,
  color,
  scales,
  spacing,
  radius,
  borderWidth,
  fontFamily,
  typography,
  shadow,
  motion,
  layout,
  zIndex,
  colorVars,
  isDirectColor,
}
