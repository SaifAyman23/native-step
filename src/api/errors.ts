import { isAxiosError } from 'axios'

import {
  ERROR_CODES,
  type ErrorCode,
  type ErrorPayload,
} from '@/api/contracts'
import i18n from '@/i18n'

export interface ApiErrorInit {
  code: ErrorCode | string
  message: string
  status: number
  messageAr?: string | null
  fields?: Record<string, string[]> | null
  detail?: unknown
  retryAfter?: number | null
  originalError?: unknown
}

/**
 * The one error shape the app handles.
 *
 * Every axios rejection is normalised into this before it reaches a hook, so
 * `onError` never has to inspect an axios or DRF-specific shape.
 */
export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly messageAr: string | null
  readonly fields: Record<string, string[]> | null
  readonly detail: unknown
  readonly retryAfter: number | null
  readonly originalError: unknown

  constructor(init: ApiErrorInit) {
    super(init.message || 'An error occurred.')
    this.message = init.message || 'An error occurred.'
    this.name = 'ApiError'
    this.code = init.code
    this.status = init.status
    this.messageAr = init.messageAr ?? null
    this.fields = init.fields ?? null
    this.detail = init.detail ?? null
    this.retryAfter = init.retryAfter ?? null
    this.originalError = init.originalError ?? null
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }

  get isTimeout(): boolean {
    return this.code === ERROR_CODES.TIMEOUT
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isValidation(): boolean {
    return this.status === 400 || this.status === 422
  }

  get isRateLimited(): boolean {
    return this.status === 429
  }

  get firstFieldError(): string | null {
    if (!this.fields) return null
    for (const messages of Object.values(this.fields)) {
      if (messages.length > 0 && messages[0]) return messages[0]
    }
    return null
  }

  /** The messages for one request field, or `null` when the field is clean. */
  fieldError(field: string): string | null {
    const messages = this.fields?.[field]
    return messages && messages.length > 0 ? messages[0] : null
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError
}

export function isErrorCode(value: unknown, code: ErrorCode | string): boolean {
  return isApiError(value) && value.code === code
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toStringList(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (typeof value === 'number' || typeof value === 'boolean') return [String(value)]
  if (Array.isArray(value)) return value.flatMap(toStringList)
  if (isRecord(value)) return Object.values(value).flatMap(toStringList)
  return []
}

function normalizeFields(value: unknown): Record<string, string[]> | null {
  if (!isRecord(value)) return null
  const fields: Record<string, string[]> = {}
  for (const [key, raw] of Object.entries(value)) {
    const messages = toStringList(raw)
    if (messages.length > 0) fields[key] = messages
  }
  return Object.keys(fields).length > 0 ? fields : null
}

function parseRetryAfter(headers: unknown, detail: unknown): number | null {
  if (isRecord(detail)) {
    const value = detail.retry_after
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
  if (!isRecord(headers)) return null
  const raw = headers['retry-after']
  if (typeof raw !== 'string' && typeof raw !== 'number') return null
  const seconds = Number(raw)
  if (Number.isFinite(seconds)) return seconds
  const date = Date.parse(String(raw))
  if (Number.isNaN(date)) return null
  return Math.max(0, Math.round((date - Date.now()) / 1000))
}

function readEnvelope(data: unknown): ErrorPayload | null {
  if (!isRecord(data) || !isRecord(data.error)) return null
  const { code, message, message_ar: messageAr, fields, detail } = data.error
  return {
    code: typeof code === 'string' ? code : ERROR_CODES.UNKNOWN,
    message: typeof message === 'string' ? message : 'Request failed.',
    message_ar: typeof messageAr === 'string' ? messageAr : null,
    fields: isRecord(fields) ? fields : null,
    detail,
  }
}

function fallbackMessage(data: unknown): string | null {
  if (!isRecord(data)) return null
  if (typeof data.detail === 'string') return data.detail
  if (typeof data.message === 'string') return data.message
  return null
}

/** Turn any thrown value into an `ApiError` without losing the original. */
export function normalizeApiError(input: unknown): ApiError {
  if (input instanceof ApiError) return input

  if (isAxiosError(input)) {
    if (!input.response) {
      const timedOut = input.code === 'ECONNABORTED' || input.code === 'ETIMEDOUT'
      return new ApiError({
        code: timedOut ? ERROR_CODES.TIMEOUT : ERROR_CODES.NETWORK_ERROR,
        message: timedOut
          ? 'The request timed out. Try again.'
          : 'No connection. Check your network and try again.',
        status: 0,
        originalError: input,
      })
    }

    const { response } = input
    const envelope = readEnvelope(response.data)
    const fields = normalizeFields(envelope?.fields) ?? normalizeFields(response.data)
    const message =
      envelope?.message ??
      fallbackMessage(response.data) ??
      (response.statusText || `Request failed with status ${response.status}`)

    return new ApiError({
      code: envelope?.code ?? ERROR_CODES.UNKNOWN,
      message,
      status: response.status,
      messageAr: envelope?.message_ar ?? null,
      fields,
      detail: envelope?.detail ?? null,
      retryAfter: parseRetryAfter(response.headers, envelope?.detail),
      originalError: input,
    })
  }

  if (input instanceof Error) {
    return new ApiError({
      code: ERROR_CODES.NETWORK_ERROR,
      message: input.message || 'An unexpected error occurred.',
      status: 0,
      originalError: input,
    })
  }

  return new ApiError({
    code: ERROR_CODES.UNKNOWN,
    message: 'An unexpected error occurred.',
    status: 0,
    originalError: input,
  })
}

/**
 * The message to show for any thrown value.
 *
 * Field validation errors are more specific than the envelope's
 * `"Validation failed."`, so the first field message wins.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred.'
): string {
  const apiError = normalizeApiError(error)
  const localized = i18n.language.startsWith('ar') ? apiError.messageAr : null
  if (localized) return localized
  if (apiError.isValidation && apiError.firstFieldError) return apiError.firstFieldError
  return apiError.message || apiError.firstFieldError || fallback
}
