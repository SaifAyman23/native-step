import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { View } from 'react-native'

export type SheetDirection = 'none' | 'forward' | 'back'

interface SheetHostApi {
  /** Open a sheet or push a new step onto the current flow. */
  present: (node: ReactNode) => void

  /** Replace the current step without adding history. */
  replace: (node: ReactNode) => void

  /** Return to the previous step, if one exists. */
  back: () => void

  /** Immediately clear the sheet flow. Used after the exit animation. */
  dismiss: () => void

  /** Animate the active sheet out, then dismiss the entire flow. */
  dismissAll: () => void

  /** Register the active surface's animated-dismiss handler. */
  registerDismissHandler: (handler: (() => void) | null) => void

  canGoBack: boolean
  isPresented: boolean
  motion: { version: number; direction: SheetDirection }
}

const SheetHostContext = createContext<SheetHostApi | null>(null)

interface SheetState {
  stack: ReactNode[]
  epoch: number
  version: number
  direction: SheetDirection
}

const INITIAL: SheetState = {
  stack: [],
  epoch: 0,
  version: 0,
  direction: 'none',
}

function apply(
  current: SheetState,
  stack: ReactNode[],
  direction: SheetDirection
): SheetState {
  const opened = current.stack.length === 0 && stack.length > 0

  return {
    stack,
    epoch: opened ? current.epoch + 1 : current.epoch,
    version: current.version + 1,
    direction,
  }
}

export function SheetHost({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SheetState>(INITIAL)
  const dismissHandler = useRef<(() => void) | null>(null)

  const present = useCallback((node: ReactNode) => {
    setState((current) =>
      apply(
        current,
        [...current.stack, node],
        current.stack.length > 0 ? 'forward' : 'none'
      )
    )
  }, [])

  const replace = useCallback((node: ReactNode) => {
    setState((current) =>
      apply(
        current,
        current.stack.length
          ? [...current.stack.slice(0, -1), node]
          : [node],
        'none'
      )
    )
  }, [])

  const back = useCallback(() => {
    setState((current) =>
      current.stack.length > 1
        ? apply(current, current.stack.slice(0, -1), 'back')
        : current
    )
  }, [])

  // Immediate cleanup. SheetSurface calls this after its exit animation.
  const dismiss = useCallback(() => {
    setState((current) =>
      current.stack.length > 0
        ? apply(current, [], 'none')
        : current
    )
  }, [])

  // Request an animated exit rather than unmounting the sheet immediately.
  const dismissAll = useCallback(() => {
    const handler = dismissHandler.current

    if (handler) {
      handler()
    } else {
      // Fallback for cases where no SheetSurface has registered yet.
      dismiss()
    }
  }, [dismiss])

  const registerDismissHandler = useCallback(
    (handler: (() => void) | null) => {
      dismissHandler.current = handler
    },
    []
  )

  const api = useMemo(
    () => ({
      present,
      replace,
      back,
      dismiss,
      dismissAll,
      registerDismissHandler,
      canGoBack: state.stack.length > 1,
      isPresented: state.stack.length > 0,
      motion: {
        version: state.version,
        direction: state.direction,
      },
    }),
    [
      back,
      dismiss,
      dismissAll,
      present,
      registerDismissHandler,
      replace,
      state.direction,
      state.stack.length,
      state.version,
    ]
  )

  const activeNode =
    state.stack.length > 0
      ? state.stack[state.stack.length - 1]
      : null

  return (
    <SheetHostContext.Provider value={api}>
      {children}

      <View
        className="absolute inset-0 z-50"
        pointerEvents="box-none"
      >
        {activeNode !== null ? (
          <Fragment key={state.epoch}>{activeNode}</Fragment>
        ) : null}
      </View>
    </SheetHostContext.Provider>
  )
}

export function useSheet() {
  const host = useContext(SheetHostContext)

  if (!host) {
    throw new Error('useSheet needs <SheetHost> mounted in the root layout')
  }

  return host
}

/**
 * The sheet host, or `null` when there is none.
 *
 * A component that offers a sheet as an option uses this, so it can be used
 * outside the app, in a test, or in the gallery, without crashing.
 */
export function useOptionalSheet() {
  return useContext(SheetHostContext)
}