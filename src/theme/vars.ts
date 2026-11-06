import { vars } from 'nativewind'

import tokens from './tokens'

/**
 * Runtime CSS-variable sets (see tailwind.config.js `addBase` for the static
 * defaults). Applying one at the root flips every semantic color at once.
 */
type ThemeVars = Record<`--${string}`, string>

export const lightThemeVars = vars(tokens.colorVars('light') as ThemeVars)
export const darkThemeVars = vars(tokens.colorVars('dark') as ThemeVars)
