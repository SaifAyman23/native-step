import type { ViewStyle } from 'react-native'

import tokens from './tokens'

export type ShadowToken = keyof typeof tokens.shadow.light

export const shadows = tokens.shadow

/** Resolve a shadow token to an RN boxShadow style for a given scheme. */
export function shadowStyle(token: ShadowToken, scheme: 'light' | 'dark'): Pick<ViewStyle, 'boxShadow'> {
  return { boxShadow: tokens.shadow[scheme][token] } as Pick<ViewStyle, 'boxShadow'>
}
