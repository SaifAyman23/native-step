import { useResolvedScheme } from '@/store/theme/themeStore'

import { colorsFor } from './colors'

/**
 * Resolved semantic colors for the active scheme. Use this when a value must be
 * a real color string (TextInput `placeholderTextColor`, Ionicons `color`,
 * Reanimated worklets) and cannot go through a Tailwind class.
 */
export function useThemeColors() {
  return colorsFor(useResolvedScheme())
}
