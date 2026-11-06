import axios, { create, type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { getCalendars } from 'expo-localization'
import { router } from 'expo-router'

import { ERROR_CODES, type TokenRefreshRequest, type TokenRefreshResponse } from '@/api/contracts'
import { normalizeApiError } from '@/api/errors'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from '@/api/session'
import i18n from '@/i18n'
import { API_BASE_URL } from '@/lib/constants'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/auth/authStore'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Do not attach the bearer token (public endpoints). */
    skipAuth?: boolean
    /** Do not attempt a 401 refresh (login, register, refresh itself). */
    skipRefresh?: boolean
    /** Do not fire handleSessionExpired on a 401 (logout — the caller handles it). */
    skipRedirect?: boolean
    /** Internal marker so a retried request cannot loop. */
    _retry?: boolean
  }
}

const ROOT = API_BASE_URL.replace(/\/+$/, '')
export const API_V1_ROOT = ROOT.endsWith('/api/v1') ? ROOT : `${ROOT}/api/v1`

const PUBLIC_AUTH_PATHS = [
  '/auth/login/',
  '/auth/register/',
  '/auth/verify-email',
  '/auth/password-reset/',
  '/auth/social/',
]

function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path))
}

const TOKEN_ERROR_CODE = ERROR_CODES.UNAUTHORIZED

/**
 * A 401 can also mean "wrong password" or "account disabled". Only a token
 * failure is worth rotating the session for; anything else must surface to the
 * caller without signing the person out.
 */
function isTokenFailure(error: AxiosError): boolean {
  const data = error.response?.data
  if (typeof data !== 'object' || data === null) return true
  const envelope = (data as { error?: { code?: unknown } }).error
  if (!envelope || typeof envelope.code !== 'string') return true
  return envelope.code === TOKEN_ERROR_CODE
}

let refreshPromise: Promise<string> | null = null
let redirecting = false

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No refresh token is stored.')

  const body: TokenRefreshRequest = { refresh }

  const { data } = await axios.post<TokenRefreshResponse>(
    `${API_V1_ROOT}/auth/token/refresh/`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': i18n.language,
      },
      timeout: 15000,
    }
  )

  await updateAccessToken(data.access, data.refresh)
  return data.access
}

/** Single-flight refresh: simultaneous 401s share one rotation. */
function getRefreshedAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function handleSessionExpired(): Promise<void> {
  await clearSession()
  useAuthStore.getState().logout()
  queryClient.clear()

  if (redirecting) return
  redirecting = true
  router.replace('/login')
  setTimeout(() => {
    redirecting = false
  }, 1500)
}

export const axiosInstance: AxiosInstance = createAxiosInstance()

function createAxiosInstance(): AxiosInstance {
  const instance = create({
    baseURL: API_V1_ROOT,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers['Accept-Language'] = i18n.language

    const timeZone = getCalendars()[0]?.timeZone
    if (timeZone) config.headers['X-Timezone'] = timeZone

    if (!config.skipAuth) {
      const token = getAccessToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config
      const status = error.response?.status

      if (
        status === 401 &&
        isTokenFailure(error) &&
        config &&
        !config._retry &&
        !config.skipRefresh &&
        !config.skipRedirect &&
        !isPublicAuthRequest(config.url) &&
        getRefreshToken()
      ) {
        config._retry = true
        try {
          const access = await getRefreshedAccessToken()
          config.headers.Authorization = `Bearer ${access}`
          return instance(config)
        } catch {
          // The refresh itself failed — for any reason (401/403 from a deleted
          // user, 500 from a server crash, network error). There is no recovery
          // path left, so clear the session and send the person to sign up.
          await handleSessionExpired()
          return Promise.reject(normalizeApiError(error))
        }
      }

      if (
        status === 401 &&
        isTokenFailure(error) &&
        !config?.skipRedirect &&
        !isPublicAuthRequest(config?.url)
      ) {
        await handleSessionExpired()
      }

      return Promise.reject(normalizeApiError(error))
    }
  )

  return instance
}
