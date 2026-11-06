import { create } from 'zustand'

export type PreviewState = 'ready' | 'loading' | 'empty' | 'error'

interface PreviewStateStore {
  state: PreviewState
  setState: (state: PreviewState) => void
}

export const usePreviewStore = create<PreviewStateStore>()((set) => ({
  state: 'ready',
  setState: (state) => set({ state }),
}))
