import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

import tokens from '@/theme/tokens'

/**
 * `twMerge` only knows Tailwind's own size scale, so `text-title` reads to it as
 * a *colour*, not a size. Paired with a real colour class — which every call
 * site here does (`text-title text-text`) — the size is the one dropped.
 *
 * The same applies to every custom scale: without `s5` in the spacing theme it
 * treats `px-s5` as an unknown class and cannot resolve it against a base
 * padding, so the base wins. Feed it the token scales so overrides work.
 *
 * The lists come from the token file, so a size added there is a size here too.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: Object.keys(tokens.spacing),
      radius: Object.keys(tokens.radius),
      color: Object.keys(tokens.color.light),
      shadow: ['l1', 'l2', 'l3'],
    },
    classGroups: {
      'font-size': [{ text: Object.keys(tokens.typography) }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
