import NetInfo, { useNetInfo } from '@react-native-community/netinfo'
import { useCallback, useEffect, useState } from 'react'

/**
 * What the network check is allowed to say.
 *
 * `auto` follows the device. `offline` and `online` force the answer, so the
 * "no connection" screen can be tested on a machine that is online, and the
 * app can be worked on from a machine that is not.
 */
export type NetworkMode = 'auto' | 'offline' | 'online'

export interface Connection {
  /** `null` until the device has answered. `false` means there is no network. */
  isConnected: boolean | null
  /** Asks the device again. Used by the retry action. */
  retry: () => void
  /** What the check is currently allowed to say. */
  mode: NetworkMode
}

/**
 * The global switch for the network check.
 *
 * It is read at build time, so changing it needs a dev server restart, and it
 * only ever applies in development. A production build always follows the
 * device, so a stale `.env` can never ship a broken gate.
 */
const ENV_MODE = (process.env.EXPO_PUBLIC_NETWORK_CHECK ?? 'auto') as NetworkMode

/**
 * How long to wait for the device before assuming it is fine.
 *
 * Without this, a device that never answers leaves the app on the splash
 * forever. Opening an app that cannot reach the network is a far better
 * failure than one that never opens at all.
 */
const UNKNOWN_TIMEOUT_MS = 4000

/** The answer the app acts on, given the mode and what the device said. */
export function resolveConnection(
  mode: NetworkMode,
  deviceIsConnected: boolean | null
): boolean | null {
  if (mode === 'offline') return false
  if (mode === 'online') return true
  return deviceIsConnected
}

/**
 * Whether this phone has a network right now.
 *
 * The app refuses to open without one, so the answer has to be known before
 * the first screen renders. `null` is the "not known yet" case, and the root
 * layout waits on it rather than guessing.
 */
export function useConnection(): Connection {
  const state = useNetInfo()
  const [assumeConnected, setAssumeConnected] = useState(false)

  const mode: NetworkMode = __DEV__ ? ENV_MODE : 'auto'

  useEffect(() => {
    if (state.isConnected !== null) return
    const timer = setTimeout(() => setAssumeConnected(true), UNKNOWN_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [state.isConnected])

  const retry = useCallback(() => {
    void NetInfo.refresh()
  }, [])

  const deviceIsConnected = state.isConnected ?? (assumeConnected ? true : null)

  return { isConnected: resolveConnection(mode, deviceIsConnected), retry, mode }
}
