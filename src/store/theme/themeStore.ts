import { useColorScheme } from 'react-native'
import { create } from 'zustand'

export type ThemeChoice = 'system' | 'light' | 'dark'

interface ThemeState {
  choice: ThemeChoice
  setChoice: (choice: ThemeChoice) => void
}

export const useThemeStore = create<ThemeState>()((set) => ({
  choice: 'system',
  setChoice: (choice) => set({ choice }),
}))

export function useResolvedScheme(): 'light' | 'dark' {
  const choice = useThemeStore((state) => state.choice)
  const system = useColorScheme()
  if (choice === 'system') return system === 'light' ? 'light' : 'dark'
  return choice
}
