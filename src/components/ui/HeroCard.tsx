import { View } from 'react-native'

import { cn } from '@/lib/utils'

import { Card } from './Card'
import { MacroBar, type BarTone } from './MacroBar'
import { QootRing } from './QootRing'

export interface HeroMacro {
  label: string
  value: number | null
  goal: number | null
  tone: BarTone
}

interface HeroCardProps {
  /** Primary value, e.g. total progress. */
  kcal: number | null
  /** Target for the primary value. */
  goal: number | null
  /** Three segments, in ring order. */
  macros: readonly HeroMacro[]
  className?: string
}

/**
 * The one hero card on Today: a 124 ring beside three macro bars.
 *
 * The ring carries the calories and the bars carry the macros, so the two halves
 * of the day are never asked to say the same number twice. The ring's three arcs
 * are the macros' own fill, not a second reading of the calories: the centre
 * already states those, and a ring that repeated them would be a different
 * number for the same thing. Nothing else belongs in this card; steps and weight
 * live in their own destinations.
 */
export function HeroCard({ kcal, goal, macros, className }: HeroCardProps) {
  const fill = (macro: HeroMacro) =>
    macro.value !== null && macro.goal !== null && macro.goal > 0
      ? Math.round((macro.value / macro.goal) * 100)
      : 0

  return (
    <Card className={cn('flex-row items-center gap-s7', className)}>
      <QootRing
        size="small"
        center="medium"
        protein={fill(macros[0])}
        carbs={fill(macros[1])}
        fat={fill(macros[2])}
        value={kcal === null ? '—' : Math.ceil(kcal).toLocaleString('en-US')}
        caption={goal === null ? '—' : `/${Math.ceil(goal).toLocaleString('en-US')} kcals`}
      />

      <View className="flex-1 gap-s4">
        {macros.map((macro) => (
          <MacroBar
            key={macro.label}
            label={macro.label}
            value={macro.value}
            goal={macro.goal}
            tone={macro.tone}
            format={(value, macroGoal) => `${value} / ${macroGoal} g`}
          />
        ))}
      </View>
    </Card>
  )
}

/** Generic alias. */
export type HeroMetric = HeroMacro
