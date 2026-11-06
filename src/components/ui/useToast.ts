import { useCallback, useEffect, useRef, useState } from 'react'

import type { ToastAlignment, ToastTone } from './Toast'

export interface ToastOptions {
  message: string
  icon?: import('react').ReactElement
  actionLabel?: string
  onAction?: () => void
  tone?: ToastTone
  alignment?: ToastAlignment
  /** Auto dismiss after ms. Set 0 to keep it up until acted on. @default 5000 */
  duration?: number
}

/**
 * Toast with a five second window for Undo. A destructive action without an
 * action label is a bug, not a shortcut.
 */
export function useToast() {
  const [state, setState] = useState<(ToastOptions & { open: boolean }) | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setState((s) => (s ? { ...s, open: false } : s))
  }, [])

  const show = useCallback((options: ToastOptions) => {
    const duration = options.duration ?? 5000
    if (timer.current) clearTimeout(timer.current)
    setState({ ...options, open: true })
    if (duration > 0) {
      timer.current = setTimeout(() => {
        timer.current = null
        setState((s) => (s ? { ...s, open: false } : s))
      }, duration)
    }
  }, [])

  return { show, hide, toast: state }
}
