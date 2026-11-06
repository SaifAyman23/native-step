import tokens from './tokens'

export type ColorScheme = 'light' | 'dark'
export type ColorToken = keyof typeof tokens.color.light

export const lightColors = tokens.color.light
export const darkColors = tokens.color.dark

/** Brand scales (DESIGN.md section 2.1) - static, theme independent. */
export const scales = tokens.scales

export function colorsFor(scheme: ColorScheme) {
  return scheme === 'dark' ? darkColors : lightColors
}
