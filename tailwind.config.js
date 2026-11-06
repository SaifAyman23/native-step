const tokens = require('./src/theme/tokens')

/**
 * Build the semantic color palette. Every semantic color is a CSS variable so
 * a single `dark` class (applied at the root by the theme store) flips the
 * whole app. Hex colors expose `R G B` triplets so Tailwind opacity modifiers
 * (`bg-surface/50`) work; rgba colors are referenced directly.
 */
const semanticColors = {}
for (const name of Object.keys(tokens.color.light)) {
  semanticColors[name] = tokens.isDirectColor(name)
    ? `var(--color-${name})`
    : `rgb(var(--color-${name}) / <alpha-value>)`
}

/**
 * DESIGN.md section 4 - the full ramp.
 *
 * Tailwind's `fontSize` utility only reads `lineHeight`, `letterSpacing` and
 * `fontWeight` from the options object. A `fontFamily` key there is silently
 * dropped, so the family cannot ride along with the size. The family is
 * therefore emitted by the plugin at the bottom of this file, which is the only
 * place that can put it in the stylesheet *after* the size utilities.
 *
 * The family is the weight. `Rubik_700Bold` is a font file, not a weight
 * request, so the ramp never sets `font-weight` on its own - that would pair a
 * Bold file with, say, a 500 weight and render the wrong face.
 */
const fontSize = Object.fromEntries(
  Object.entries(tokens.typography).map(([name, t]) => [
    name,
    [
      `${t.fontSize}px`,
      {
        lineHeight: `${t.lineHeight}px`,
        letterSpacing: `${t.letterSpacing}px`,
      },
    ],
  ])
)

/** Every `text-*` step carries the Rubik file that token was designed in. */
const typographyFamilies = Object.fromEntries(
  Object.entries(tokens.typography).map(([name, t]) => [
    `.text-${name}`,
    { fontFamily: t.fontFamily },
  ])
)

/**
 * Explicit family overrides. They are emitted *after* the type ramp so
 * `text-caption font-rubik-bold` really is Rubik Bold, not the caption face.
 */
const familyUtilities = {
  '.font-rubik': { fontFamily: tokens.fontFamily.regular },
  '.font-rubik-medium': { fontFamily: tokens.fontFamily.medium },
  '.font-rubik-semibold': { fontFamily: tokens.fontFamily.semiBold },
  '.font-rubik-bold': { fontFamily: tokens.fontFamily.bold },
  '.font-rubik-extrabold': { fontFamily: tokens.fontFamily.extraBold },
}

const spacing = Object.fromEntries(
  Object.entries(tokens.spacing).map(([name, value]) => [name, `${value}px`])
)

const borderRadius = Object.fromEntries(
  Object.entries(tokens.radius).map(([name, value]) => [name, `${value}px`])
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...semanticColors,
        // Brand scales (DESIGN.md section 2.1) - static, theme independent.
        ...tokens.scales,
      },
      spacing,
      borderRadius,
      // The design hairline is 1.5px, not Tailwind's 1px default.
      borderWidth: {
        DEFAULT: `${tokens.borderWidth.hairline}px`,
      },
      fontSize,
      boxShadow: {
        l1: 'var(--shadow-l1)',
        l2: 'var(--shadow-l2)',
        l3: 'var(--shadow-l3)',
      },
      transitionDuration: {
        fast: `${tokens.motion.fast}ms`,
        base: `${tokens.motion.base}ms`,
        slow: `${tokens.motion.slow}ms`,
      },
    },
  },
  plugins: [
    // Default the CSS variables on the root so the theme is valid before the
    // runtime vars() switch runs (and on web).
    ({ addBase }) =>
      addBase({
        ':root': tokens.colorVars('light'),
        '.dark:root': tokens.colorVars('dark'),
      }),
    // The type ramp's families, then the explicit overrides. Both are emitted
    // after Tailwind's core `fontSize` utilities, so a `text-*` step keeps its
    // own face and a `font-rubik-*` class still wins.
    ({ addUtilities }) => {
      addUtilities(typographyFamilies)
      addUtilities(familyUtilities)
    },
  ],
}
