import { useWindowDimensions } from 'react-native'

export function useIsMobile(breakpoint = 768): boolean {
  const { width } = useWindowDimensions()
  return width < breakpoint
}
