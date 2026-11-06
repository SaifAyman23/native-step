import * as Haptics from 'expo-haptics'

/**
 * Haptics, in the three shapes the app needs.
 *
 * A tap that moves a choice, a tap that commits something, and a tap that
 * reports an outcome. Every call is fire-and-forget and never throws: the
 * engine is missing on some devices and on web, and a missing buzz is never a
 * reason to break a screen.
 */

/** A tap that moves between options: a segment, a tab, a picked row. */
export function tapSelection() {
  void Haptics.selectionAsync().catch(() => {})
}

/** A tap that commits something: save, send, confirm, toggle. */
export function tapImpact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  void Haptics.impactAsync(style).catch(() => {})
}

/** The outcome of an action the user was waiting on. */
export function tapResult(type: Haptics.NotificationFeedbackType) {
  void Haptics.notificationAsync(type).catch(() => {})
}
