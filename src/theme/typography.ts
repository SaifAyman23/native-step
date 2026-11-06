import type { TextStyle } from 'react-native'

import tokens from './tokens'

export type TypographyVariant = keyof typeof tokens.typography

/** DESIGN.md section 4 - layout only; color is applied by the consumer. */
export const typography = tokens.typography as Record<TypographyVariant, TextStyle>

export const fontFamily = tokens.fontFamily
