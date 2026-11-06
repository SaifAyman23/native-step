import { queryClient } from '@/lib/queryClient'

/**
 * Generic session-reset helpers for the template.
 *
 * Single source of truth for "wipe local state for the current account" so
 * callers (account switch, sign out) stay decoupled from individual stores
 * and the React Query cache. No domain stores here by design.
 */

/** Drop every cached query (auth/me, accounts, ...). */
export async function clearQueryCache(): Promise<void> {
  await queryClient.clear()
}

/**
 * Full sign-out / account-switch sequence: clears the React Query cache.
 * Callers handle the auth store and persisted tokens separately so this
 * helper stays dependency-light and generic.
 */
export async function resetSessionState(): Promise<void> {
  await clearQueryCache()
}

/** Clear the persisted session tokens (implement with your storage layer). */
export async function clearPersistedSession(): Promise<void> {
  // No-op in the template: wire to your secure storage on first use.
}
