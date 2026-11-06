import * as SecureStore from 'expo-secure-store'

import type { AuthTokens } from '@/api/contracts'

const SESSION_KEY = 'qoot.session'

interface Session {
  access: string
  refresh: string
}

let session: Session | null = null

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.access === 'string' && typeof candidate.refresh === 'string'
}

export function getAccessToken(): string | null {
  return session?.access ?? null
}

export function getRefreshToken(): string | null {
  return session?.refresh ?? null
}

/** Restore the persisted session once at app start. */
export async function loadSession(): Promise<Session | null> {
  if (session) return session

  const raw = await SecureStore.getItemAsync(SESSION_KEY)
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isSession(parsed)) {
      session = parsed
    } else {
      await SecureStore.deleteItemAsync(SESSION_KEY)
    }
  } catch {
    await SecureStore.deleteItemAsync(SESSION_KEY)
  }

  return session
}

async function saveSession(next: Session): Promise<void> {
  session = next
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(next))
}

/** Persist the token pair returned by login/verify/social. */
export async function saveAuthSession(tokens: AuthTokens): Promise<void> {
  await saveSession({ access: tokens.access, refresh: tokens.refresh })
}

/** Store a rotated access token, and the rotated refresh token when issued. */
export async function updateAccessToken(access: string, refresh?: string): Promise<void> {
  if (!session) return
  await saveSession({
    ...session,
    access,
    refresh: refresh ?? session.refresh,
  })
}

export async function clearSession(): Promise<void> {
  session = null
  await SecureStore.deleteItemAsync(SESSION_KEY)
}
